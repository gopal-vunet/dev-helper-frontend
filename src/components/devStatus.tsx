import { FunctionComponent } from 'react'
import { DevStatus } from '../models/devStatus';


export const DevStatusComp: FunctionComponent<DevStatus> = (props) => {

    function getStatusColor() {
        switch (props.status) {
            case 'leave':
                return 'bg-danger';
            case 'wfh':
                return 'bg-warning';
            default:
                return 'bg-success';
        }
    }

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-end flex-row">
                    <div className="col">
                        <h6 className="card-title">{props.developer.name}</h6>
                    </div>
                    <div>
                        <span className={"badge rounded-pill " + getStatusColor()}>{props.status}</span>
                    </div>
                </div>
                <p className="card-subtitle mb-2 text-muted">{props.developer.role}</p>
            </div>
        </div>
    );
}



