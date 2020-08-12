import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, queryByPlaceholderText, queryAllByTestId, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe('Application', () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"))
    fireEvent.click(getByText('Tuesday'));
    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change((queryByPlaceholderText(appointment, /Enter Student Name/i)),{ target: { value: 'Lydia Miller-Jones' } });
    fireEvent.click(queryAllByTestId(appointment, 'interviewer-face')[0]);
    fireEvent.click(getByText(appointment, 'Save'));

    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();
  
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    expect(getByText(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();

    const mon = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(mon, /no spots remaining/i)).toBeInTheDocument();
  });



  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[1];
    // 3. Click the "delete" button on the first filled appointment slot.
    fireEvent.click(getByAltText(appointment, /Delete/i));
    // 4. confirm that Delete the appointment? is displayed in the article.
    expect(getByText(appointment, /Delete the appointment/i)).toBeInTheDocument();
    // 5. Click the confirm button.
    fireEvent.click(getByText(appointment, /Confirm/i));
    // 7. Confirm that 'Deleting...' is displayed in the article.
    expect(getByText(appointment, /Deleting/i)).not.toBe(null);
    // 6. Wait for the axios delete promise.
    await waitForElement(() => getByAltText(appointment, /Add/i));
    // 8. Confirm that the empty mode is displayed.
    expect(getByAltText(appointment, /Add/i)).not.toBe(null);
    // 9. Check that the DayListItem with the text "Monday" has increased by 1".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();

  });


  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, /Archie Cohen/i));
    const appointment = getAllByTestId(container, "appointment")[2];
    // console.log(prettyDOM(appointment));
    // 3. Click the "edit" button on the first filled appointment slot.
    fireEvent.click(getByAltText(appointment, /Edit/i));
    // 5. Change the input value with new name.
    fireEvent.change((queryByPlaceholderText(appointment, /Leopold Silvers/i)),{ target: { value: 'Juni' } });
    fireEvent.click(getByText(appointment, 'Save'));
    // 6. Wait for the axios update promise.
    await waitForElement(() => getByAltText(appointment, /Edit/i));
    // 9. Check that the DayListItem with the text "Monday" is the same".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });


  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change((queryByPlaceholderText(appointment, /Enter Student Name/i)),{ target: { value: 'Lydia Miller-Jones' } });
    fireEvent.click(queryAllByTestId(appointment, 'interviewer-face')[0]);
    fireEvent.click(getByText(appointment, 'Save'));

    await waitForElement(() => getByText(appointment, /Error/i));
    expect(getByText(appointment, /Error/i)).toBeInTheDocument();

  });



  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, /Archie Cohen/i));
    const appointment = getAllByTestId(container, "appointment")[2];
    // console.log(prettyDOM(appointment));
    // 3. Click the "delete" button on the first filled appointment slot.
    fireEvent.click(getByAltText(appointment, /Delete/i));
    fireEvent.click(getByText(appointment, 'Confirm'));

    await waitForElement(() => getByText(appointment, /Error/i));
    expect(getByText(appointment, /Error/i)).toBeInTheDocument();

  });


});