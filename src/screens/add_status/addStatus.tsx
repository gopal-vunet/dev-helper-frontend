import axios from 'axios';
import { FunctionComponent, useContext, useLayoutEffect, useReducer, useState } from 'react'
import { AuthContext } from '../../context/authContext';
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

    // initial, // No Data
    // loaded, // Developers, request
    // formUpdate,
    // updating, // Developers, request
    // updated, // Developers, request(reset)
}

interface Action {
    event: Event,
    state?: AddStatusState
}

interface AddStatusState {
    request: AddStatusRequest
    developers: Developer[],
    updating: boolean
}

function reducer(state: AddStatusState, action: Action) {
    switch (action.event) {
        case Event.addDevelopers:
            return action.state!
        case Event.updateRequest:
            return state
        case Event.addDeveloperToDB:
            return { ...state, updating: true }
        case Event.addedDeveloperToDB:
            return { developers: state.developers, updating: false, request: getInitialFormData() }
        default:
            return state
    }
}

function getDate() {
    const date = new Date()
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

function getInitialFormData(){
    return { date: getDate(), status: 'select', developer: 0 }
}

export const AddStatus: FunctionComponent = () => {

    let initialState = {
        request: getInitialFormData(),
        developers: [],
        updating: false,
    }

    const [state, dispatch] = useReducer(reducer, initialState)
    const [request, setRequest] = useState<AddStatusRequest>({ date: getDate(), status: 'select', developer: 0 })

    useLayoutEffect(() => {
        axios.get(`${baseUrl}/developers/`).then((response) => {
            if (response.status === 200) {
                dispatch({ event: Event.addDevelopers, state: { ...state, developers: response.data } })
            }
        })
    }, []);



    return (
        <div className='d-flex justify-content-center mt-4 '>
            <div style={{ width: 300 }}>

                <div className="mb-3">
                    <label htmlFor="" className="form-label">Date</label>
                    <p className="form-control">{getDate()}</p>
                </div>

                <div className="mb-3">
                    <label htmlFor="developer" className="form-label">Select Developer</label>
                    <select name="developer" value={state.request.developer} className="form-select " id="developer" onChange={(event) => onDeveloperSelected(event.target.value)}>
                        <option value={0} key={'select-developer'} >Select</option>
                        {state.developers.map((dev) => <option value={dev.id} key={dev.id}>{dev.name}</option>)}
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

                <div className="mb-3">
                    <button className='btn btn-primary' value="Add" onClick={(event) => state.updating ? null : updateStatus()} >
                        {
                            state.updating
                                ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                : 'Add'
                        }
                    </button>
                </div>
            </div>
        </div>
    );

    function updateStatus(): void {

        if (request.developer === 0) {
            alert('Select Developer')
            return
        }

        if (request.status === 'select') {
            alert('Select Status')
            return
        }

        dispatch({ event: Event.addDeveloperToDB })
        axios.post(`${baseUrl}/update-status/`, request).then((response) => {
            dispatch({ event: Event.addedDeveloperToDB })

            if (response.status === 200) {
                alert('Updated')
            }

        }).catch((e) => {
            dispatch({ event: Event.addedDeveloperToDB })
        })
    }

    function onDeveloperSelected(developerId: any) {
        let req = { ...request }
        req.developer = parseInt(developerId, 10)
        setRequest(req);
    }

    function onStatusSelected(status: string) {
        let req = { ...request }
        req.status = status
        setRequest(req);
    }
}

