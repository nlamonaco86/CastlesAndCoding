import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';

function HeroForm(props) {
    return (<form>
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control bg-dark text-white" id="name" placeholder="Enter Your Name"></input>
        </div>
        <div class="form-group">
            <label for="class">Class</label>
            <select class="form-control bg-dark text-white" id="class">
                <option>Warrior</option>
                <option>Wizard</option>
                <option>Cleric</option>
                <option>Thief</option>
            </select>
        </div>
        <div class="form-group">
            <label for="lastWords">Last Words?</label>
            <input type="text" class="form-control bg-dark text-white" id="lastWords" placeholder="It's dangerous out there..."></input>
        </div>
        <div className="row justify-content-center">
            <button className="mt-5 bg-danger text-white">CREATE</button>
        </div>
        <div className="row justify-content-center">
            <Link to="./" className="mt-5 bg-danger text-white" style={{padding: "5px", textDecoration: "none"}}>MAIN MENU</Link>
        </div>
    </form>)
}

export default HeroForm;