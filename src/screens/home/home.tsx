import axios from 'axios';
import { FunctionComponent, useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DevStatusComp } from '../../components/devStatus';
import { Developer } from '../../models/develper';
import { DevStatus } from '../../models/devStatus';
import { baseUrl } from '../../utils/const';


export const HomePage: FunctionComponent = () => {

    const [developers, setDevelopers] = useState<Developer[]>([])
    const [devStatus, setDevStatus] = useState<DevStatus[]>([])

    useLayoutEffect(() => {
        axios.get(`${baseUrl}/developers/`).then((response) => {
            if (response.status === 200) {
                setDevelopers(response.data)
            }
        })
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

    if (developers.length === 0) {
        return (
            <div className='container align-middle d-flex justify-content-center mt-4'>
                <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
                    <span className="sr-only"></span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container px-4">
                <div className="row gx-5">
                    <div className="col mt-4">
                        <div className="p-2 border bg-light">
                            Developer Status on {getDate()}
                        </div>
                        <div className='card mt-4'>
                            {
                                devStatus.length === 0
                                    ? <li className="list-group-item">No Updates yet!</li>
                                    : devStatus.map((status) => <DevStatusComp {...status} />)
                            }
                        </div>


                    </div>
                    <div className="col mt-4">
                        <div className="p-2 border bg-light">
                            Developers
                        </div>

                        <div className="card mt-4">
                            <ul className=" list-group list-group-flush">
                                {developers.map((dev) => <li key={dev.id} className="list-group-item">{dev.id} - {dev.name} - {dev.role}</li>)}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

