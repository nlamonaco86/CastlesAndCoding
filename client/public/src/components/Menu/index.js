import React from 'react';
import "./style.css";
import {Link} from 'react-router-dom';

function Menu(props) {
    return (
        <div className="container mt-5 vt" style={{ border: "double", color: "white", borderWidth: "15px", maxWidth: "800px", minHeight: "800px" }}>

            <div className="row justify-content-center text-danger vt-lg">{props.title}</div>

            <div className="row justify-content-center">
                <img src={props.img.src} className="img-fluid" alt={props.img.alt}></img>
            </div>

            <div className="row justify-content-center">

                <div className="text-center">
                    {props.options.map(option => {
                        return <div style={{ padding: "10px" }}>
                                    <Link to={option.href} className="a">{option.title}</Link>
                               </div>;
                    })}
                </div>

            </div>

        </div>
    )
}

export default Menu;