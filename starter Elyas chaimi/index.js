const fs = require("fs");
const axios = require("axios");

const levels = {
  Débutant: 1,
  Intermédiaire: 2,
  Avancé: 3,
  Courant: 4,
  "Langue maternelle": 5,
};

const transform = async (input) => {
  const countryData = await axios.get(
    "https://restcountries.eu/rest/v2/name/" + input.country
  );

  var output = {
    id: input.id,
    firtname: input.firstname,
    lastname: input.lastname,
    dob: input.birthday,
    address: {
      zipCode: input.zipCode,
      street: input.street,
      city: input.city,
      countryCode: countryData.data[0].alpha2Code,
    },
    experiences: [],
    certificates: [
      {
        date: input.certificates[0].date,
        certificate: input.certificates[0].certificate.title,
        type: input.certificates[0].certificateType.title,
      },
    ],
    languages: [
      {
        languageId: input.languages[0].id,
        title: input.languages[0].title,
        levelTitle: input.languages[0].level,
      },
    ],
  };

  if (input.languages[0].level == "Langue maternelle") {
    output.languages[0]["level"] = 5;
  }

  for (var i = 0; i < input.experiences.length; i++) {
    var Boucle = {
      companyName: input.experiences[i].companyName,
      startDate: input.experiences[i].startDate,
      endDate: input.experiences[i].endDate,
      jobId: input.experiences[i].job.id,
    };

    output.experiences.push(Boucle);
  }

  return output;
};

(async () => {
  const inStr = fs.readFileSync("./in.json", "UTF-8"); //
  const jsonIn = JSON.parse(inStr);
  const output = await transform(jsonIn);
  const outStr = JSON.stringify(output, null, 2);
  fs.writeFileSync("./out.json", outStr);
})();
