import React from 'react';
import "./style.css";
import HeroForm from '../HeroForm/';
import MonsterForm from '../MonsterForm';
import DungeonForm from '../DungeonForm';
// import { Link } from 'react-router-dom';

function Creator(props) {
    let typeOfForm;
    switch (props.type) {
        case "hero":
            typeOfForm = <HeroForm />
            break;
        case "monster":
            typeOfForm = <MonsterForm />
            break;
        case "dungeon":
            typeOfForm = <DungeonForm />
            break;
    }
    return (
        <div className="container mt-5 vt" style={{ border: "double", color: "white", borderWidth: "15px", maxWidth: "900px", minHeight: "800px" }}>

            <div className="row justify-content-center text-danger vt-lg">{props.title}</div>

            <div className="row justify-content-between container">

                <div className="col-lg-7 ">
                        <img src={props.img.src} className="img-fluid" alt={props.img.alt}></img>
                </div>

                <div className="col-lg-5">
                    {typeOfForm}
                </div>

                <div className="text-center text-danger">
                </div>

            </div>

        </div>
    )
}

export default Creator;