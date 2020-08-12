import React, { useState, useEffect } from 'react';
import axios from 'axios';
// const WebSocket = require("ws");


export function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });



  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onopen = function() {
      webSocket.send('ping');
    };

    webSocket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === 'SET_INTERVIEW') {
        setState(state => {
          const appointment = {
            ...state.appointments[data.id],
            interview: data.interview
          };
          const appointments = {
            ...state.appointments,
            [data.id]: appointment
          };

          return {...state, appointments};
        });

        if (data.interview === null) {
          if (data.type === 'SET_INTERVIEW' && data.interview === null) {
            setState(state => {
              const appointment = {
                ...state.appointments[data.id],
                interview: data.interview
              };
              const appointments = {
                ...state.appointments,
                [data.id]: appointment
              };
    
              return {...state, appointments};
            });
            setState((state) => {
              const daysCopy = [];
            for (let i of state.days) {
              daysCopy.push(i);
              if (i.name === state.day) {
                daysCopy[daysCopy.indexOf(i)].spots += 1;
              }
            }
              return {...state, days: daysCopy};
            });
          }
        } 
      }
    };
    return () => {
      webSocket.close();
    }
  },[]);


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
      
      setState((state) => {
        const daysCopy = [];
      for (let i of state.days) {
        daysCopy.push(i);
        if (i.name === state.day) {
          daysCopy[daysCopy.indexOf(i)].spots -= 1;
        }
      }
        return {...state, days: daysCopy};
      });

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
      setState((state) => {
        const daysCopy = [];
      for (let i of state.days) {
        daysCopy.push(i);
        if (i.name === state.day) {
          daysCopy[daysCopy.indexOf(i)].spots += 1;
        }
      }
        return {...state, days: daysCopy};
      });
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