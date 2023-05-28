import { Main } from "../components/global/Main";
import { Link } from "react-router-dom";
import { FormEditAdmin } from "../components/FormEditAdmin";

export const AccessPage = () => {
  
  return (
    <Main page={"teachers_page"}>
      <Link className="btn btn-primary" to={"/orders"}>Volver</Link>
      <div className="row mt-5 text-center rounded">
        <h3>Cambiar los datos de acceso</h3>
        <div className="col-12 d-flex justify-content-center shadow-lg p-4">
          <FormEditAdmin />
        </div>
      </div>
    </Main>
  );
};
