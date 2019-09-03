const express = require('express');
const routerPDF = express.Router();
const pdfMake = require('../pdfmake/pdfmake');
const vfsFonts = require('../pdfmake/vfs_fonts');
const tempStudent = require('../models/student-temp-model.js');
const strandStudent = require('../models/admin-enrollment-strands-model.js');
const enrollmentSettings = require('../models/admin-enrollment-settings-model.js');
const tempNewStudent = require('../models/student-temp-new-model.js');
const keys = require('../config/keys');

const mongoose = require('mongoose');

mongoose.connect(keys.mongodb.url,{useNewUrlParser:true},(err)=>{
  if(err) throw err;
});

pdfMake.vfs = vfsFonts.pdfMake.vfs;

routerPDF.post('/pdf', (req, res, next)=>{




    tempStudent.find({dob: req.session.dob, timeIn: req.session.studentTime , date: req.session.studentDate}, (err, user)=>{

      strandStudent.find({strands: req.session.strand}, (err, user2)=>{

        enrollmentSettings.find({}, (err, user3)=>{

          tempNewStudent.find({timeIn: req.session.studentTime , date: req.session.studentDate}, (err, user4)=>{

          if(req.session.studentClassification ==='new student'){
            if (user.length === 1){

              var documentDefinition = {
                  content: [
                  {
                    text: 'Republic of the Philippines',
                    fontSize: 11, alignment: 'center'
                  },
                  {
                    text: 'Department of Education',
                    fontSize: 11, alignment: 'center'
                  },
                  {
                    text: 'Region III',
                    fontSize: 11, alignment: 'center'
                  },

                  {
                    text: 'Dolores StandAlone Senior Highschool',
                    fontSize: 13, bold:true, alignment: 'center'
                  },
                  {
                    text: 'Dolores City of San Fernando (P)',
                    fontSize: 11, alignment: 'center'
                  },
                  {
                    text: 'Tel No. (045)-402-5467',
                    fontSize: 11, alignment: 'center'
                  },
                  {
                    text: '_______________________________________________________________________________________________'
                  },

                  {
                    text:'\n\nLEARNERS DATA VERIFICATION FORM', fontSize: 11, bold:true, alignment: 'center'
                  },
                  {
                    columns:[


                      {
                        width: 'auto',
                        text: '\nLRN: ' + user[0].lrn + '\n\nFULLNAME: ' + user[0].lastname.charAt(0).toUpperCase() + user[0].lastname.slice(1) + " " + user[0].firstname.charAt(0).toUpperCase() + user[0].firstname.slice(1) + ", " + user[0].middlename.charAt(0).toUpperCase() + "." +
                        '\n\nAGE: ' + user[0].age + " yrs old" + '\n\nCONTACT: ' + user[0].phone + '\n\nTRACK/STRAND: ' + user[0].strand + '\n\nADDRESS: ' + user[0].address + ' ' + user[0].barangay + ' ' + user[0].city
                      },

                      {
                        width: 'auto',
                        text: '\n\n\n\n\nBIRTHDATE: ' + user[0].dob + '\n\nGRADE LEVEL: ' + user[0].yearLevel.charAt(0).toUpperCase() + user[0].yearLevel.slice(1),
                         margin:[100,0,0,0]
                      }
                    ]

                  },



                  {
                    text:"\n\nGUARDIAN'S INFORMATION:", fontSize: 11, bold:true, alignment: 'center'
                  },


                  {
                    text: '\nGUARDIANS NAME: ' + user[0].lastnameGuardian.charAt(0).toUpperCase() + user[0].lastnameGuardian.slice(1) + " " + user[0].firstnameGuardian.charAt(0).toUpperCase() + user[0].firstnameGuardian.slice(1) + " " + user[0].middlenameGuardian.charAt(0).toUpperCase() + "."
                    + '\n\nRELATIONSHIP TO LEARNER: ' + user[0].relationGuardian + "\n\nGUARDIAN'S CONTACT NUMBER: " + user[0].phoneGuardian + "\n\nOCCUPATION: " + user[0].occupationGuardian
                  },
                  {
                    text: '\n\n\n\n\n_____________________________________________', alignment: 'right'
                  },


                  {
                    text: 'Signature of the Learner over Printed Name', alignment: 'right' , bold: true
                  },

                  {
                    qr: 'LRN: ' + user[0].lrn + '\nFULLNAME: ' + user[0].firstname + '_' + user[0].lastname,  fit:70, alignment: 'right', margin:[0, 115, 0, 0]
                  },
                  {
                    text: '\n\n\nBASIC EDUCATION ENROLLMENT FORM',
                    fontSize: 13, bold:true, alignment: 'center'
                  },
                  {
                    text: 'THIS FORM IS NOT FOR SALE',
                    fontSize: 9, alignment: 'center'
                  },
                  {
                    text: '\n\nSchool Year: ' + user3[0].academicFirst + ' - ' + user3[0].academicEnds + '\nSemester: ' + user3[0].semester + '\nTrack: ' + user2[0].tracks  + '\nStrand: ' + user[0].strand
                  },
                  {
                    text: '_______________________________________________________________________________________________'
                  },
                  {
                    text: '\n\nSTUDENT INFORMATION',
                    fontSize: 11, bold:true, alignment: 'center'
                  },

                  {
                    columns:[
                      {
                        width: 'auto',
                        text: '\nLRN: ' + user[0].lrn + '\n\nFULLNAME: ' + user[0].lastname.charAt(0).toUpperCase() + user[0].lastname.slice(1) + " " + user[0].firstname.charAt(0).toUpperCase() + user[0].firstname.slice(1) + ", " + user[0].middlename.charAt(0).toUpperCase() + "." +
                        '\n\nBIRTHDATE: ' + user[0].dob + '\n\nAGE: ' + user[0].age + " yrs old" + '\n\nADDRESS: ' + user[0].address + " " + user[0].barangay + " " + user[0].city + "\n\nMOTHER'S MAIDEN NAME: " + user[0].motherLastname.charAt(0).toUpperCase() + user[0].motherLastname.slice(1) + " " + user[0].motherFirstname.charAt(0).toUpperCase() + user[0].motherFirstname.slice(1) + ", " + user[0].motherMiddlename.charAt(0).toUpperCase() + "." +
                        "\n\nFATHER'S NAME: " + user[0].fatherLastname.charAt(0).toUpperCase() + user[0].fatherLastname.slice(1) + " " + user[0].fatherFirstname.charAt(0).toUpperCase() + user[0].fatherFirstname.slice(1) + ", " + user[0].fatherMiddlename.charAt(0).toUpperCase() + "." +
                        '\n\nGUARDIANS NAME: ' + user[0].lastnameGuardian.charAt(0).toUpperCase() + user[0].lastnameGuardian.slice(1) + " " + user[0].firstnameGuardian.charAt(0).toUpperCase() + user[0].firstnameGuardian.slice(1) + " " + user[0].middlenameGuardian.charAt(0).toUpperCase() + "\n\nGUARDIAN'S CONTACT NUMBER: " + user[0].phoneGuardian
                      },
                      {
                        width: 'auto',
                        text: '\n\n\nSEX: ' + user[0].gender.charAt(0).toUpperCase() + user[0].gender.slice(1) + '\n\nIP COMMUNITY: ' + user[0].indigenousType,
                        margin:[100,0,0,0]
                      }
                    ]
                  },

                  {
                    text:"\n\n\nI hereby certify that the above information given are true and correct to the best of my knowledge and I allow the Department of Education to use my child's detailes to create and/or update his/her learner profile in the Learner Information System. The information herein shall be treated as confidential in compliance with the Data Privacy Act of 2012.",
                    fontSize: 11
                  },

                  {
                    columns:[


                      {
                        width: 'auto',
                        text: '\n\n\n\nDate: ' + user[0].date

                      },


                      {
                        width: 'auto',
                        text: '\n\n\n\n_____________________________________' + "\nGuardian/Parent's Signature", margin:[200,0,0,0]

                      },
                      {
                        qr: 'LRN: ' + user[0].lrn + '\nFULLNAME: ' + user[0].firstname + '_' + user[0].lastname,  fit:70, alignment: 'right', margin:[0, 135, 0, 0]
                      },


                    ]
                  },
                  {
                    text: '\n\n\nDepartment of Education',
                    fontSize: 11, alignment: 'center'
                  },
                  {
                    text: 'Region III',
                    fontSize: 11, alignment: 'center'
                  },
                  {
                    text: 'Division of City of San Fernando (P)',
                    fontSize: 11, alignment: 'center'
                  },

                  {
                    text: 'Dolores StandAlone Senior Highschool',
                    fontSize: 13, bold:true, alignment: 'center'
                  },
                  {
                    text: 'Dolores City of San Fernando (P)',
                    fontSize: 11, alignment: 'center'
                  },

                  {
                    text:'MAKA-DIYOS, MAKA-TAO, MAKAKALIKASAN, MAKABANSA', fontSize: 11, bold:true, alignment: 'center'
                  },

                  {
                    text: '_______________________________________________________________________________________________'
                  },

                  {
                    columns:[
                      {
                      width: 'auto',
                      text: '\nFULLNAME: ' + user[0].lastname.charAt(0).toUpperCase() + user[0].lastname.slice(1) + " " + user[0].firstname.charAt(0).toUpperCase() + user[0].firstname.slice(1) + ", " + user[0].middlename.charAt(0).toUpperCase() + "." +
                      '\n\nGRADE AND SECTION: ' + user[0].yearLevel + "-" + user4[0].section.toUpperCase() +  '\n\nTRACK/STRAND: ' + user[0].strand + '\n\nADDRESS: ' + user4[0].tbCurAddress + '\n\nCONTACT: ' + user[0].phone
                    },{
                      width: 'auto',
                      text: '\n\n\nAGE: ' + user[0].age + " Years Old" + '\n\nGENDER: ' + user[0].gender.charAt(0) + user[0].gender.slice(1),
                      margin:[100,0,0,0]
                    }
                  ]
                },
                {
                  text: '\nELEMENTARY', bold: true
                },
                {
                  columns:[
                    {
                      width: 'auto',
                      text: 'SCHOOL NAME:' + user4[0].elemName
                    },
                    {
                      width: 'auto',
                      text: 'YEAR GRADUATED: ' + user4[0].elemYear, margin: [100, 0,0,0]
                    }
                  ]
                },
                {
                  text: '\nHIGH SCHOOL', bold: true
                },
                {
                  columns:[
                    {
                      width: 'auto',
                      text: 'SCHOOL NAME: ' + user4[0].hsName
                    },
                    {
                      width: 'auto',
                      text: 'YEAR GRADUATED: ' + user4[0].hsYear, margin: [100, 0,0,0]
                    }
                  ]
                },

                {
                  text: "\nFATHER'S INFORMATION", bold: true
                },
                {
                  columns:[
                    {
                      width: 'auto',
                      text: 'NAME: ' + user4[0].fatherName + '\n\nADDRESS: ' + user4[0].fatherAddress + '\n\nCONTACT: ' + user4[0].fatherContact
                    },
                    {
                      width: 'auto',
                      text: 'BIRTHDATE: ' + user4[0].fatherDob + '\n\nOCCUPATION: ' + user4[0].fatherOccupation,
                      margin: [100, 0,0,0]
                    }
                  ]
                },

                {
                  text: "\nMOTHER'S INFORMATION", bold: true
                },
                {
                  columns:[
                    {
                      width: 'auto',
                      text: 'NAME: ' + user4[0].motherName + '\n\nADDRESS: ' + user4[0].motherAddress + '\n\nCONTACT: ' + user4[0].motherContact
                    },
                    {
                      width: 'auto',
                      text: 'BIRTHDATE: ' + user4[0].motherDob + '\n\nOCCUPATION: ' + user4[0].motherOccupation,
                      margin: [100, 0,0,0]
                    }
                  ]
                },
                {
                  text: "\nPARENTS", bold: true
                },
                {
                  text: user4[0].parentStatus
                },
                {
                  width: 'auto',
                  text: '\n\n_____________________________________' + "\nStudent's Signature", margin:[300,0,0,0]

                },
                {
                  qr: 'LRN: ' + user[0].lrn + '\nFULLNAME: ' + user[0].firstname + '_' + user[0].lastname,  fit:70, alignment: 'right', margin:[0,10,0,0]
                }

                ]
              }

              const pdfDoc = pdfMake.createPdf(documentDefinition);
              pdfDoc.getBase64((data)=>{
                  res.writeHead(200,
                  {
                      'Content-Type': 'application/pdf',
                      'Content-Disposition':'attachment;filename=' + user[0].firstname + "_" + user[0].lastname + ".pdf"
                  });

                  const download = Buffer.from(data.toString('utf-8'), 'base64');
                  res.end(download);
              });
            }



















          }else if(req.session.studentClassification ==='old student'){
            if (user.length === 1){

              var documentDefinition = {
                  content: [
                  {
                    text: 'Republic of the Philippines',
                    fontSize: 11, alignment: 'center'
                  },
                  {
                    text: 'Department of Education',
                    fontSize: 11, alignment: 'center'
                  },
                  {
                    text: 'Region III',
                    fontSize: 11, alignment: 'center'
                  },

                  {
                    text: 'Dolores StandAlone Senior Highschool',
                    fontSize: 13, bold:true, alignment: 'center'
                  },
                  {
                    text: 'Dolores City of San Fernando (P)',
                    fontSize: 11, alignment: 'center'
                  },
                  {
                    text: 'Tel No. (045)-402-5467',
                    fontSize: 11, alignment: 'center'
                  },
                  {
                    text: '_______________________________________________________________________________________________'
                  },

                  {
                    text:'\n\nLEARNERS DATA VERIFICATION FORM', fontSize: 11, bold:true, alignment: 'center'
                  },
                  {
                    columns:[


                      {
                        width: 'auto',
                        text: '\nLRN: ' + user[0].lrn + '\n\nFULLNAME: ' + user[0].lastname.charAt(0).toUpperCase() + user[0].lastname.slice(1) + " " + user[0].firstname.charAt(0).toUpperCase() + user[0].firstname.slice(1) + ", " + user[0].middlename.charAt(0).toUpperCase() + "." +
                        '\n\nAGE: ' + user[0].age + " yrs old" + '\n\nCONTACT: ' + user[0].phone + '\n\nTRACK/STRAND: ' + user[0].strand + '\n\nADDRESS: ' + user[0].address + ' ' + user[0].barangay + ' ' + user[0].city
                      },

                      {
                        width: 'auto',
                        text: '\n\n\n\n\nBIRTHDATE: ' + user[0].dob + '\n\nGRADE LEVEL: ' + user[0].yearLevel.charAt(0).toUpperCase() + user[0].yearLevel.slice(1),
                         margin:[100,0,0,0]
                      }
                    ]

                  },



                  {
                    text:"\n\nGUARDIAN'S INFORMATION:", fontSize: 11, bold:true, alignment: 'center'
                  },


                  {
                    text: '\nGUARDIANS NAME: ' + user[0].lastnameGuardian.charAt(0).toUpperCase() + user[0].lastnameGuardian.slice(1) + " " + user[0].firstnameGuardian.charAt(0).toUpperCase() + user[0].firstnameGuardian.slice(1) + " " + user[0].middlenameGuardian.charAt(0).toUpperCase() + "."
                    + '\n\nRELATIONSHIP TO LEARNER: ' + user[0].relationGuardian + "\n\nGUARDIAN'S CONTACT NUMBER: " + user[0].phoneGuardian + "\n\nOCCUPATION: " + user[0].occupationGuardian
                  },
                  {
                    text: '\n\n\n\n\n_____________________________________________', alignment: 'right'
                  },


                  {
                    text: 'Signature of the Learner over Printed Name', alignment: 'right' , bold: true
                  },

                  {
                    qr: 'LRN: ' + user[0].lrn + '\nFULLNAME: ' + user[0].firstname + '_' + user[0].lastname,  fit:70, alignment: 'right', margin:[0, 115, 0, 0]
                  },
                  {
                    text: '\n\n\nBASIC EDUCATION ENROLLMENT FORM',
                    fontSize: 13, bold:true, alignment: 'center'
                  },
                  {
                    text: 'THIS FORM IS NOT FOR SALE',
                    fontSize: 9, alignment: 'center'
                  },
                  {
                    text: '\n\nSchool Year: ' + user3[0].academicFirst + ' - ' + user3[0].academicEnds + '\nSemester: ' + user3[0].semester + '\nTrack: ' + user2[0].tracks  + '\nStrand: ' + user[0].strand
                  },
                  {
                    text: '_______________________________________________________________________________________________'
                  },
                  {
                    text: '\n\nSTUDENT INFORMATION',
                    fontSize: 11, bold:true, alignment: 'center'
                  },

                  {
                    columns:[
                      {
                        width: 'auto',
                        text: '\nLRN: ' + user[0].lrn + '\n\nFULLNAME: ' + user[0].lastname.charAt(0).toUpperCase() + user[0].lastname.slice(1) + " " + user[0].firstname.charAt(0).toUpperCase() + user[0].firstname.slice(1) + ", " + user[0].middlename.charAt(0).toUpperCase() + "." +
                        '\n\nBIRTHDATE: ' + user[0].dob + '\n\nAGE: ' + user[0].age + " yrs old" + '\n\nADDRESS: ' + user[0].address + " " + user[0].barangay + " " + user[0].city + "\n\nMOTHER'S MAIDEN NAME: " + user[0].motherLastname.charAt(0).toUpperCase() + user[0].motherLastname.slice(1) + " " + user[0].motherFirstname.charAt(0).toUpperCase() + user[0].motherFirstname.slice(1) + ", " + user[0].motherMiddlename.charAt(0).toUpperCase() + "." +
                        "\n\nFATHER'S NAME: " + user[0].fatherLastname.charAt(0).toUpperCase() + user[0].fatherLastname.slice(1) + " " + user[0].fatherFirstname.charAt(0).toUpperCase() + user[0].fatherFirstname.slice(1) + ", " + user[0].fatherMiddlename.charAt(0).toUpperCase() + "." +
                        '\n\nGUARDIANS NAME: ' + user[0].lastnameGuardian.charAt(0).toUpperCase() + user[0].lastnameGuardian.slice(1) + " " + user[0].firstnameGuardian.charAt(0).toUpperCase() + user[0].firstnameGuardian.slice(1) + " " + user[0].middlenameGuardian.charAt(0).toUpperCase() + "\n\nGUARDIAN'S CONTACT NUMBER: " + user[0].phoneGuardian
                      },
                      {
                        width: 'auto',
                        text: '\n\n\nSEX: ' + user[0].gender.charAt(0).toUpperCase() + user[0].gender.slice(1) + '\n\nIP COMMUNITY: ' + user[0].indigenousType,
                        margin:[100,0,0,0]
                      }
                    ]
                  },

                  {
                    text:"\n\n\nI hereby certify that the above information given are true and correct to the best of my knowledge and I allow the Department of Education to use my child's detailes to create and/or update his/her learner profile in the Learner Information System. The information herein shall be treated as confidential in compliance with the Data Privacy Act of 2012.",
                    fontSize: 11
                  },

                  {
                    columns:[


                      {
                        width: 'auto',
                        text: '\n\n\n\nDate: ' + user[0].date

                      },


                      {
                        width: 'auto',
                        text: '\n\n\n\n_____________________________________' + "\nGuardian/Parent's Signature", margin:[200,0,0,0]

                      },
                      {
                        qr: 'LRN: ' + user[0].lrn + '\nFULLNAME: ' + user[0].firstname + '_' + user[0].lastname,  fit:70, alignment: 'right', margin:[0, 135, 0, 0]
                      },
                    ]
                  },


                ]
              }

              const pdfDoc = pdfMake.createPdf(documentDefinition);
              pdfDoc.getBase64((data)=>{
                  res.writeHead(200,
                  {
                      'Content-Type': 'application/pdf',
                      'Content-Disposition':'attachment;filename=' + user[0].firstname + "_" + user[0].lastname + ".pdf"
                  });

                  const download = Buffer.from(data.toString('utf-8'), 'base64');
                  res.end(download);
              });
            }
          }
          });
        });
      });
    });

});


module.exports = routerPDF;
