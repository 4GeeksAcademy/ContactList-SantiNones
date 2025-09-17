import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../hooks/useGlobalReducer";
import { actions } from "../store";
import ContactCard from "../components/ContactCard";
import { API, AGENDA } from "../apiConfig";

export const ContactList = () => {
  const { store, dispatch } = useContext(Context);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const res = await fetch(`${API}/agendas/${AGENDA}/contacts`);

        if (res.status === 404) {
          // agenda no existe → crear y dejar vacío
          const createRes = await fetch(`${API}/agendas/${AGENDA}`, { method: "POST" });
          if (!createRes.ok) throw new Error("No se pudo crear la agenda");
          dispatch({ type: actions.SET_CONTACTS, payload: [] });
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        dispatch({ type: actions.SET_CONTACTS, payload: data.contacts || [] });
      } catch (err) {
        console.error("loadContacts error:", err);
        dispatch({ type: actions.SET_CONTACTS, payload: [] });
      }
    };

    loadContacts();
  }, [dispatch]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-end mb-3">
        <Link to="/add" className="btn btn-success">
          Add new contact
        </Link>
      </div>

      <h2>Contactos</h2>

      <ul className="list-group">
        {store.contacts.length > 0 ? (
          store.contacts.map((contact) => <ContactCard key={contact.id} contact={contact} />)
        ) : (
          <li className="list-group-item">No hay contactos, añade uno.</li>
        )}
      </ul>
    </div>
  );
};