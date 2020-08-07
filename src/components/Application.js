import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import Appointment from "./Appointment";
import axios from 'axios';
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from '../helpers/selectors';
import "components/Application.scss";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointmentsUpdate = {
      ...state.appointments,
      [id]: appointment
    };
    setState({...state, appointments: appointmentsUpdate});
    
    return axios.put(`/api/appointments/${id}`, {interview} )
    .then((res) => {
      return setState({...state, appointments: appointmentsUpdate});
    })
    .catch((error) => {
      console.log(error);
    })
  };

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

  console.log('state.interviewers = ', state.interviewers);
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
          let interviewersArray = getInterviewersForDay(state, state.day);
          return <Appointment key={appt.id}{...appt} interview={int} interviewers={interviewersArray} bookInterview={bookInterview} />
          })}
        <Appointment id="last" time="1pm" />
      </section>
    </main>
  );
}
