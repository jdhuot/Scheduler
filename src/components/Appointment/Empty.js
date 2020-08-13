import React from 'react';

// Empty component to display empty appointment
export default function Empty(props) {
  return (
    <main className="appointment__add">
      <img
        className="appointment__add-button"
        src="images/add.png"
        alt="Add"
        onClick={props.onAdd}
        data-testid="add-button2"
      />
    </main>
  );
};