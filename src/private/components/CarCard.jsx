import { Link } from "react-router-dom";

export const CarCard = ({car}) => {
  const { id, plate, brand, model } = car;
  return (
    <>
      <div className="bg-dark text-white col-10 py-3">
        <div className="card-body d-flex flex-column align-items-center justify-content-center">
          <h2 className="">{plate}</h2>
          <div className="mt-3 pt-1 col-12 text-center">
            <p className="mb-0 mt-2 text-white ">Marca: {brand}</p>
            <p className="mb-0 mt-2 text-white ">Modelo: {model}</p>
          </div>
          <div className="d-flex justify-content-center gap-2 pt-4">
            <Link to={`/car/${plate}/createorder`}>
              <button className="btn btn-primary">Crear orden</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
