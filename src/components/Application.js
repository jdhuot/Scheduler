import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import Appointment from "./Appointment";
import axios from 'axios';
import { getAppointmentsForDay, getInterview } from '../helpers/selectors';

import "components/Application.scss";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });


  useEffect(() => {
    const promiseOne = axios.get('/api/days');
    const promiseTwo = axios.get('/api/appointments');
    const promiseThree = axios.get('/api/interviewers');

    Promise.all([promiseOne, promiseTwo, promiseThree])
    .then((arrayOfValues) => {
      let [daysData, apptData, interviewersData] = arrayOfValues;
      setState((prev) => {
        return ({...prev, days: daysData.data,
        appointments: apptData.data,
        interviewers: interviewersData.data
        })
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }, []);

  const displayAppts = getAppointmentsForDay(state, state.day)

  console.log('displayAppts = ', displayAppts);
  return (
    <main className="layout">
      <section className="sidebar"> 
        <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state['days']} day={state['day']} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {displayAppts.map((appt) => {
          let int = getInterview(state, appt.interview);
          return <Appointment key={appt.id}{...appt} interview={int} />
          })}
        <Appointment id="last" time="1pm" />
      </section>
    </main>
  );
}
