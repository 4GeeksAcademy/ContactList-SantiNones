
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../hooks/useGlobalReducer";
import { actions } from "../store";
import { API, AGENDA } from "../apiConfig";

const ContactCard = ({ contact }) => {
  const { dispatch } = useContext(Context);

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que quieres borrar este contacto?")) return;

    try {
      // 1) intento global
      let res = await fetch(`${API}/contacts/${contact.id}`, { method: "DELETE" });

      // 2) fallback con agenda si 404 (según instancia)
      if (res.status === 404) {
        res = await fetch(`${API}/agendas/${AGENDA}/contacts/${contact.id}`, {
          method: "DELETE",
        });
      }

      if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText);
        throw new Error(`Delete failed: ${res.status} ${msg}`);
      }

      // actualiza UI local
      dispatch({ type: actions.DELETE_CONTACT, payload: contact.id });
    } catch (error) {
      console.error(error);
      alert("No se pudo borrar el contacto.");
    }
  };

  return (
    <li className="list-group-item p-3">
      <div className="row align-items-center">
        <div className="col-sm-12 col-md-3 text-center mb-3 mb-md-0">
          <img
            src={`https://i.pravatar.cc/150?u=${contact.email}`}
            className="rounded-circle"
            alt={contact.name}
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        </div>

        <div className="col-sm-12 col-md-7">
          <h4 className="mb-3">{contact.name}</h4>
          <p className="text-muted">
            <i className="fas fa-map-marker-alt me-3"></i>
            {contact.address}
          </p>
          <p className="text-muted">
            <i className="fas fa-phone me-3"></i>
            {contact.phone}
          </p>
          <p className="text-muted">
            <i className="fas fa-envelope me-3"></i>
            {contact.email}
          </p>
        </div>

        <div className="col-sm-12 col-md-2 d-flex align-items-start justify-content-end">
          <Link
            to={`/edit/${contact.id}`}
            className="btn"
            state={{ contactToEdit: contact }}
            title="Edit"
          >
            <i className="fas fa-pencil-alt fs-5"></i>
          </Link>

          <button className="btn" onClick={handleDelete} title="Delete">
            <i className="fas fa-trash-alt fs-5"></i>
          </button>
        </div>
      </div>
    </li>
  );
};

export default ContactCard;