import React, { useState, useEffect } from 'react';
import axios from 'axios';


export function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  ///// reducer attempt :(

  // const initialState = {
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // };

  // function reducer(state, action) {
  //   const { type, payload } = action;
  //   return { ...state, [type]: payload };
  // }

  // const setDay = function(day) {
  //   dispatch({ type: 'day', payload: day });
  // }

  // const [state, dispatch] = useReducer(reducer, initialState);

  ////


  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {interview} )
    .then((res) => {
      const daysCopy = [];
      for (let i of state.days) {
        daysCopy.push(i);
        if (i.name === state.day) {
          daysCopy[daysCopy.indexOf(i)].spots -= 1;
        }
      }
      setState({...state, days: daysCopy});
      // dispatch({ type: 'days', payload: daysCopy }); // reducer attempt
      return setState({...state, appointments});
      // return dispatch({ type: 'appointments', payload: appointments }); // reducer attempt
    })
  };

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`, {appointment} )
    .then((res) => {
      const daysCopy = [];
      for (let i of state.days) {
        daysCopy.push(i);
        if (i.name === state.day) {
          daysCopy[daysCopy.indexOf(i)].spots += 1;
        }
      }
      setState({...state, days: daysCopy});
      // dispatch({ type: 'days', payload: daysCopy }); // reducer attempt
      return setState({...state, appointments});
      // return dispatch({ type: 'appointments', payload: appointments }); // reducer attempt
    })
  };

  useEffect(() => {
    const promiseOne = axios.get('/api/days');
    const promiseTwo = axios.get('/api/appointments');
    const promiseThree = axios.get('/api/interviewers');

    Promise.all([promiseOne, promiseTwo, promiseThree])
    .then((arrayOfValues) => {
      let [daysData, apptData, interviewersData] = arrayOfValues;
      setState((prev) => { // old way
        return ({...prev, days: daysData.data,
        appointments: apptData.data,
        interviewers: interviewersData.data
        })
      })

      // reducer attempt
      // dispatch({ type: 'days', payload: daysData.data });
      // dispatch({ type: 'appointments', payload: apptData.data });
      // dispatch({ type: 'interviewers', payload: interviewersData.data });

    })
    .catch((error) => {
      console.log(error);
    })
  }, []);



  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}

export default useApplicationData;