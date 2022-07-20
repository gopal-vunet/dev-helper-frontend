import axios from 'axios';
import { FunctionComponent, useCallback, useContext, useEffect, useLayoutEffect, useReducer, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Developer } from '../../models/develper';
import { baseUrl } from '../../utils/const';

interface AddStatusRequest {
    developer: number,
    date: string,
    status: string
}

enum Event {
    addDevelopers,
    updateRequest,
    addDeveloperToDB,
    addedDeveloperToDB,
}

interface Action {
    event: Event,
    payload?: any
}

interface AddStatusState {
    request: AddStatusRequest
    developers: Developer[],
    updating: boolean
}

function reducer(state: AddStatusState, action: Action) {
    switch (action.event) {
        case Event.addDevelopers:
            return { ...state, developers: action.payload }
        case Event.updateRequest:
            return { ...state, request: action.payload }
        case Event.addDeveloperToDB:
            return { ...state, updating: true }
        case Event.addedDeveloperToDB:
            return { developers: state.developers, updating: false, request: getInitialFormData() }
        default:
            return state
    }
}

export function getDate() {
    const date = new Date()
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

function getInitialFormData() {
    return { date: getDate(), status: 'select', developer: 0 }
}

export const AddStatus: FunctionComponent = () => {

    const param = useParams()
    const navigate = useNavigate()

    let initialState = {
        request: getInitialFormData(),
        developers: [],
        updating: false,
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    useLayoutEffect(() => {
        axios.get(`${baseUrl}/developers/`).then((response) => {
            if (response.status === 200) {
                dispatch({ event: Event.addDevelopers, payload: response.data })
                if (param) {
                    onDeveloperSelected(param.devId ?? '0')
                }
            }
        })
    }, []);

    return (
        <div className='d-flex justify-content-center mt-4' >
            <div style={{ maxWidth: 700, minWidth: 450, minHeight: 250 }} className="card p-4">

                {
                    state.developers.length === 0
                        ? <span className="spinner-border spinner-border mx-auto my-auto" role="status" aria-hidden="true"></span>
                        : (<>
                            <div className="mb-3">
                                <label htmlFor="" className="form-label">Date</label>
                                <input value={getDate()} className="form-control" readOnly />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="developer" className="form-label">Select Developer</label>
                                <select disabled={param.devId !== undefined} name="developer" value={state.request.developer} className="form-select " id="developer" onChange={(event) => onDeveloperSelected(event.target.value)} >
                                    <option value={0} key={'select-developer'} >Select</option>
                                    {(state.developers as Developer[]).map((dev) => <option value={dev.id} key={dev.id}>{dev.name}</option>)}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="" className="form-label">Select Status</label>
                                <select name="Status" value={state.request.status} id="status" className="form-select" onChange={(event) => onStatusSelected(event.target.value)}>
                                    <option value='select'>Select</option>
                                    <option value="wfh">WFH</option>
                                    <option value="wfo">WFO</option>
                                    <option value="leave">Leave</option>
                                </select>
                            </div>

                            <div className="d-grid gap-2">
                                <button className='btn btn-primary' value="Add" onClick={(event) => state.updating ? null : updateStatus()} >
                                    {
                                        state.updating
                                            ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            : 'Add'
                                    }
                                </button>
                                {/* <button className='btn' onClick={(e)=> navigate('/add')}>Select another user</button> */}
                               
                            </div>
                        </>)
                }


            </div>
        </div>
    );

    function updateStatus(): void {

        if (state.request.developer === 0) {
            alert('Select Developer')
            return
        }

        if (state.request.status === 'select') {
            alert('Select Status')
            return
        }

        dispatch({ event: Event.addDeveloperToDB })
        axios.post(`${baseUrl}/update-status/`, state.request).then((response) => {
            dispatch({ event: Event.addedDeveloperToDB })

            if (response.status === 200) {
                alert('Updated')
            }

        }).catch((e) => {
            dispatch({ event: Event.addedDeveloperToDB })
        })
    }

    function onDeveloperSelected(developerId: any) {
        console.log(developerId)
        let req = { ...state.request }
        req.developer = parseInt(developerId, 10)
        dispatch({ event: Event.updateRequest, payload: req });
    }

    function onStatusSelected(status: string) {
        let req = { ...state.request }
        req.status = status
        dispatch({ event: Event.updateRequest, payload: req });
    }
}
