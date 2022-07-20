import axios from 'axios';
import { FunctionComponent, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DevStatusComp } from '../../components/devStatus';
import { Developer } from '../../models/develper';
import { DevStatus } from '../../models/devStatus';
import { baseUrl } from '../../utils/const';


export const HomePage: FunctionComponent = () => {

    const [devStatus, setDevStatus] = useState<DevStatus[]>([])
    const [filters, setFilters] = useState(['wfh', 'leave'])

    const [developers, setDevelopers] = useState<Developer[]>([])
    const [loading, setLoading] = useState(false)
    const [reloading, setReloading] = useState(false)
    const [error, setError] = useState(false)
    const [search, setSearch] = useState('')

    const getDevelopers = useCallback(() => {
        const cancelToken = axios.CancelToken
        const source = cancelToken.source()
        let isSearching = search.trimEnd() !== '';

        isSearching ? setReloading(true) : setLoading(true)

        let url = `${baseUrl}/developers/`;
        axios.get(
            url,
            { params: isSearching ? { search: search } : {} }
        ).then((response) => {
            if (response.status === 200) {
                setDevelopers(response.data)
            }
            isSearching ? setReloading(false) : setLoading(false)
        }).catch((e) => {
            isSearching ? setReloading(false) : setLoading(false)
        })

    }, [search])


    useEffect(() => {
        getDevelopers()
    }, [search]);

    const filteredStatus = useMemo(() => {

        if (filters.length === 0) {
            return devStatus
        }
        else {
            let statuses = devStatus.filter(status => {
                for (const index in filters) {
                    if (status.status === filters[index]) {
                        return true
                    }
                }
            })
            return statuses.filter(val => val.developer.name.toLowerCase().includes(search.toLocaleLowerCase()))
        }
    }, [devStatus, filters, getDevelopers])

    function toggleFilter(filter: string) {
        if (filters.includes(filter)) {
            setFilters([...filters].filter(val => val !== filter))
        } else {
            setFilters([...filters, filter])
        }
    }

    useEffect(() => {
        axios.get(`${baseUrl}/dev-status/${getDate()}`).then((response) => {
            if (response.status === 200) {
                setDevStatus(response.data)
            }
        })
    }, []);

    function getDate() {
        const date = new Date()
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    }

    return (

        <div className="container px-4">
            <div className="row gx-5">
                {
                    <div className="col mt-4">
                        <div className="p-2 border bg-light">
                            Developer Status on {getDate()}
                        </div>

                        {devStatus.length === 0
                            ? <div style={{ maxWidth: 700, minWidth: 450, minHeight: 250 }} className="card p-4">
                                <span className="spinner-border spinner-border mx-auto my-auto" role="status" aria-hidden="true"></span>
                            </div>

                            :
                            <>
                                <div className='mt-4' role="group">
                                    {/* <div className="col">
                                        <button className={`btn btn${filters.includes('wfh') ? '-secondary' : '-outline-secondary'}`} onClick={(e) => toggleFilter('wfh')} >WFH</button>
                                    </div>
                                    <div className="col">
                                        <button className={`btn btn${filters.includes('wfo') ? '-secondary' : '-outline-secondary'}`} onClick={(e) => toggleFilter('wfo')} >WFO</button>
                                    </div>
                                    <div className="col">
                                        <button className={`btn btn${filters.includes('leave') ? '-secondary' : '-outline-secondary'}`} onClick={(e) => toggleFilter('leave')} >LEAVE</button>
                                    </div> */}

                                    <div className="d-flex btn-group" role="group" aria-label="Basic checkbox toggle button group">
                                        <input onClick={(e) => toggleFilter('wfh')} type="button" className={`btn btn${filters.includes('wfh') ? '-secondary' : '-outline-secondary'}`} id="wfh" autoComplete="off" value="WFH" />
                                        {/* <label className={`btn btn${filters.includes('wfh') ? '-secondary' : '-outline-secondary'}`} htmlFor="wfh">WFH</label> */}

                                        <input onClick={(e) => toggleFilter('wfo')} type="button" className={`btn btn${filters.includes('wfo') ? '-secondary' : '-outline-secondary'}`} id="wfo" autoComplete="off" value="WFO"/>
                                        {/* <label className={`btn btn${filters.includes('wfo') ? '-secondary' : '-outline-secondary'}`} htmlFor="wfo">WFO</label> */}

                                        <input onClick={(e) => toggleFilter('leave')} type="button" className={`btn btn${filters.includes('leave') ? '-secondary' : '-outline-secondary'}`} id="leave" autoComplete="off" value="LEAVE" />
                                        {/* <label className={`btn btn${filters.includes('leave') ? '-secondary' : '-outline-secondary'}`} htmlFor="leave">LEAVE</label> */}
                                    </div>

                                </div>
                                <div className='card mt-4'>
                                    {
                                        filteredStatus.length === 0
                                            ? <li className="list-group-item">No updates found!</li>
                                            : filteredStatus.map((status) => <DevStatusComp {...status} key={status.developer.id} />)
                                    }
                                </div>
                            </>
                        }
                    </div>
                }

                {/* <Developers {...devStatus[0]}/> */}
                <div className="col mt-4">

                    <div className="p-2 border bg-light">
                        Developers
                    </div>

                    {loading

                        ? <div style={{ maxWidth: 700, minWidth: 450, minHeight: 250 }} className="card p-4">
                            <span className="spinner-border spinner-border mx-auto my-auto" role="status" aria-hidden="true"></span>
                        </div>

                        : <>
                            <div className='input-group mt-4'>
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search developers' className="form-control" />
                                <button className="btn btn-outline-secondary" onClick={getDevelopers} type="button">Search</button>
                            </div>

                            {developers.length === 0
                                ? <p> No developers found</p>
                                : <>
                                    <div className="card mt-4">
                                        <ul className=" list-group list-group-flush">
                                            {developers.map((dev) => <li key={dev.id} className="list-group-item"><Link to={'/add/' + dev.id}> {dev.id} - {dev.name} </Link> - {dev.role}</li>)}
                                        </ul>
                                    </div>
                                </>
                            }
                        </>
                    }
                </div>
            </div>
        </div>

    );
}

