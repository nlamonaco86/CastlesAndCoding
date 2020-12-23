import React from 'react';
import "./style.css";

function MainMenu() {
    return (
        <div className="container mt-5 vt" style={{border: "double", color: "white", borderWidth: "15px"}}>
            <div className="row justify-content-center text-danger">CASTLES & CODING</div>
            <div className="row">

                <div className="col-lg-6">
                    <div>
                    <a className="a">CREATE</a>
                    </div>
                    <div>
                    <a className="a">VIEW</a>
                    </div>
                    <div>
                    <a className="a">BATTLE</a>
                    </div>
                    <div>
                    <a className="a">VISIT TOWN</a>
                    </div>
                    <div>
                    <a className="a">MAIN MENU</a>
                    </div>               
                 
                </div>

                <div className="col-lg-6">
                   DRAGON GOES HERE
                </div>

            </div>

        </div>

    )
}

export default MainMenu;