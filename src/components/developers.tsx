import axios from 'axios';
import { config } from 'process';
import { FC, FunctionComponent, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Developer } from '../models/develper';
import { DevStatus } from '../models/devStatus';
import { getDate } from '../screens/add_status/addStatus';
import { baseUrl } from '../utils/const';


const Developers: FunctionComponent<DevStatus> = (props) => {

    const [developers, setDevelopers] = useState<Developer[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [search, setSearch] = useState('')

    const getDevelopers = useCallback(() => {
        const cancelToken = axios.CancelToken
        const source = cancelToken.source()

        console.log('props')
        console.log(props)

        setLoading(true)

        let url = `${baseUrl}/developers/`;
        axios.get(
            url,
            { params: search.trimEnd() !== '' ? { search: search } : {} }
        ).then((response) => {
            if (response.status === 200) {
                setDevelopers(response.data)
            }
            setLoading(false)
        }).catch((e) => {
            setLoading(false)
        })

    }, [search])

    useEffect(() => {
        getDevelopers()
    }, []);


    return (
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
    );
}

export default Developers;
