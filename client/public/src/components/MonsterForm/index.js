import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';

function MonsterForm(props) {
    return (
        <form>
            <div class="form-row vt-md">
                <div class="form-group col-md-8">
                    <label for="name">Name</label>
                    <input type="email" class="form-control bg-dark text-white" id="name" placeholder="Name"></input>
                </div>
                <div class="form-group col-md-4">
                    <label for="level">Level</label>
                    <input type="number" class="form-control bg-dark text-white" id="level" placeholder="Level"></input>
                </div>
            </div>
            <div class="form-row vt-md">
                <div class="form-group col-md-4">
                    <label for="hp">HP</label>
                    <input type="number" class="form-control bg-dark text-white" id="level" placeholder="0"></input>
                </div>
                <div class="form-group col-md-4">
                    <label for="xp">XP</label>
                    <input type="number" class="form-control bg-dark text-white" id="xp" placeholder="0"></input>
                </div>
                <div class="form-group col-md-4">
                    <label for="inputPassword4">Armor</label>
                    <input type="armor" class="form-control bg-dark text-white" id="armor" placeholder="0"></input>
                </div>
            </div>
            <div class="form-row vt-md justify-content-center">
            <label for="damage" className="">Damage</label>
            </div>
            <div class="form-row vt-md">
                <div class="form-group col-md-6">
                    <input type="number" class="form-control bg-dark text-white" id="damageLow" placeholder="Low"></input>
                </div>
                <div class="form-group col-md-6">
                    <input type="number" class="form-control bg-dark text-white" id="damageHigh" placeholder="High"></input>
                </div>
            </div>
            <div class="form-row vt-md">
                <div class="form-group col-md-4">
                    <label for="crit">Crit</label>
                    <input type="number" class="form-control bg-dark text-white" id="critChance" placeholder="0"></input>
                </div>
                <div class="form-group col-md-4">
                    <label for="block">Block</label>
                    <input type="number" class="form-control bg-dark text-white" id="blockChance" placeholder="0"></input>
                </div>
                <div class="form-group col-md-4">
                    <label for="gold">Gold</label>
                    <input type="number" class="form-control bg-dark text-white" id="gold" placeholder="0"></input>
                </div>
            </div>
            <div class="form-row vt-md">
                <div class="form-group col-md-12">
                    <label for="description">Description</label>
                    <input type="text" class="form-control bg-dark text-white" id="description" placeholder="Describe the monster..."></input>
                </div>
            </div>
            <div className="row justify-content-center">
                <button className="mt-3 bg-danger text-white">CREATE</button>
            </div>
            <div className="row justify-content-center">
                <Link to="./" className="mt-3 bg-danger text-white" style={{ padding: "5px", textDecoration: "none" }}>MAIN MENU</Link>
            </div>
        </form>
    )
}

export default MonsterForm;