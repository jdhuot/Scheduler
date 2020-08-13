import React, { useState } from 'react';
import Button from '../Button';
import InterviewerList from '../InterviewerList';

// Form component for creating or editing an interview
export default function Form(props) {
  let [name, setName] = useState(props.name || "");
  let [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  // Reset function which is called in cancel() to reset the form, and reset interviewer state
  const reset = function(e) {
    setName("");
    e.target.value="";
    setInterviewer(null);
  }
  // Cancel function to be run when user clicks cancel on form, it will call the reset function
  const cancel = function(e) {
    props.onCancel();
    reset(e);
  }

  // Function to be called to validate if input has been typed in
  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    // If there is indeed a name typed in, call the save function to book the interview
    props.onSave(name, interviewer);
    setError("");
  }

  // Render the form on the page
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name={name}
            value={name}
            type="text"
            placeholder={props.name ? props.name : "Enter Student Name"}
            onChange={e => setName(e.target.value)}
            data-testid="student-name-input"
            //  ^^ This must be a controlled component
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={e => cancel(e)} >Cancel</Button>
          <Button confirm onClick={e => validate()} >Save</Button>
        </section>
      </section>
    </main>
  );
};