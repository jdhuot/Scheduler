import React, { useState, Fragment, useEffect } from "react";
import DayList from "./DayList";
import Appointment from "./Appointment";
import axios from 'axios';
import getAppointmentsForDay from '../helpers/selectors';

import "components/Application.scss";


export default function Application(props) {
  // const [ day, setDay ] = useState("Monday");
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  const setDays = days => setState(prevDays => ({ ...prevDays, days }));
  const setAppointments = appointments => setState(prevAppts => ({ ...prevAppts, appointments }));
  const setInterviewers = interviewers => setState(prevInterviewers => ({ ...prevInterviewers, interviewers }));


  useEffect(() => {
    const promiseOne = axios.get('/api/days');
    const promiseTwo = axios.get('/api/appointments');
    const promiseThree = axios.get('/api/interviewers');

    Promise.all([promiseOne, promiseTwo, promiseThree])
    .then((arrayOfValues) => {
      let [daysData, apptData, interviewersData] = arrayOfValues;
      console.log('daysData = ' + daysData.data);
      console.log('apptData = ' + apptData.data);
      setDays(daysData.data);
      setAppointments(apptData.data);
      setInterviewers(interviewersData.data);
    })
    .catch((error) => {
      console.log(error);
    })
  }, []);

  let displayAppts = getAppointmentsForDay(state, state.day)

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
        <Fragment>
          {displayAppts.map((appt) => {return <Appointment key={displayAppts.indexOf(appt)}{...appt} />})}
          <Appointment id="last" time="1pm" />
        </Fragment>
      </section>
    </main>
  );
}
