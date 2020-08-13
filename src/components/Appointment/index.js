import React, { Fragment, useEffect } from 'react';
import "./styles.scss";
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Error from './Error';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import useVisualMode from '../../hooks/useVisualMode';

export default function Appointment(props) {
  
  // Mode values for conditionally displaying the form
  const EMPTY = "EMPTY";
  const SHOW = "SHOW"; // Appointment is booked
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM"; // Confirm delete, or cancel
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const DELETING = "DELETING";

  // Bring in mode state, transition and back functions from useVisualMode custom hoook
  const { mode, transition, back } = useVisualMode(
    // If there's an interview, default to SHOW else EMPTY
    props.interview ? SHOW : EMPTY
  );

  // Save interview after creating or editing an interview
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    
    // If editing, run editInterview (found useApplicationData custom hook) 
    // instead of bookInterview which will keep days count the same
    if(mode === 'EDIT') {
      props
      .editInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
    } else {
      // Create interview with bookInterview function (found useApplicationData custom hook)
      props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
    }
  }

  // Delete the interview by running cancelInterview (found useApplicationData custom hook)
  function deleteInterview(id) {

    transition(DELETING, true);

    props
     .cancelInterview(id)
     .then(() => transition(EMPTY))
     .catch(error => transition(ERROR_DELETE, true));
  }

  // Conditional to SHOW interview mode if there is an interview, else show EMPTY
  useEffect(() => { 

    if (mode === 'EMPTY' && props.interview) {
      transition(SHOW);
     }
     if (mode === 'SHOW' && props.interview === null) {
      transition(EMPTY);
     }
  },[props.interview, transition, mode]);

  // Render the various form with appropriate props conditionally based on the current mode state
  return (
    <Fragment>
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && props.interview && (
                        <Show
                          student={props.interview.student}
                          interviewer={props.interview.interviewer}
                          onDelete={e => transition(CONFIRM)}
                          onEdit={e => transition(EDIT)}
                        />
    )}
    {mode === CREATE && (
                        <Form 
                        interviewers={props.interviewers}
                        onSave={save} 
                        onCancel={() => back()} 
                        bookInterview={props.bookInterview}
                        id={props.id}
                        interview={props.interview}
                        />
    )}
    {mode === EDIT && (
                        <Form 
                        interviewers={props.interviewers}
                        onSave={save} 
                        name={props.interview.student}
                        onCancel={() => back()} 
                        bookInterview={props.editInterview}
                        id={props.id}
                        interview={props.interview}
                        interviewer={props.interview.interviewer.id}
                        />
    )}
    {mode === SAVING && (
                        <Status 
                        message="Saving..."
                        />
    )}
    {mode === DELETING && (
                        <Status 
                        message="Deleting..."
                        />
    )}
    {mode === ERROR_DELETE && (
                        <Error 
                        message="Could not delete appointment"
                        onClose={() => back()} 
                        />
    )}
    {mode === ERROR_SAVE && (
                        <Error 
                        message="Could not save appointment"
                        onClose={() => back()} 
                        />
    )}
    {mode === CONFIRM && (
                        <Confirm 
                        message="Delete the appointment?"
                        onConfirm={() => deleteInterview(props.id)}
                        onCancel={() => back()} 
                        />
    )}
    </ Fragment>
  );
};