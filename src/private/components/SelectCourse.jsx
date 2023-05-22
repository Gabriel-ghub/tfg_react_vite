export const SelectCourse = ({ courses, setCourseId }) => {
  return (
    <>
      <div className="col-12 col-md-6">
        <label htmlFor="courses" className="form-label">
          Curso
        </label>
        <select
          className="form-select w-100"
          name=""
          id="courses"
          onChange={(event) => setCourseId(event.target.value)}
          defaultValue="--"
        >
          <option disabled> -- </option>
          {courses.map((course) => {
            return (
              <option key={course.id} value={course.id}>
                {course.name} ({course.year})
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};
