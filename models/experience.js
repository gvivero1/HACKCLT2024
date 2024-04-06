
const experience = {
  years: { type: Number }, // for how long
  role: { type: String }, // what position was held
  responsibilities: [{ type: String }], // duties performed
  experienceName: { type: String }, // project, activity, certification, work experience, etc
  location: { type: String } // where
};

function Experience(years, role, responsibilities, experienceName, location){
    this.years = years;
    this.role = role;
    this.responsibilities = responsibilities;
    this.experienceName = experienceName;
    this.location = location;
}

// const exp = new Experience("data");

module.exports = experience;