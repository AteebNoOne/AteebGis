import axios from "axios";
import jsPDF from 'jspdf';

const apiUrl = process.env.REACT_APP_BASE_URL;

export const generateSignsHTML = async (wfD, id) => {
  const reviewers = wfD.reviewer;
  if (!reviewers) {
    console.log("No reviewers found.");
    return '';
  }
  const usernames = reviewers.split(',');

  let htmlContent = ''; 

  for (const username of usernames) {
    try {
      const url = `https://test.node.docgis.com/ateeb/get-sign?username=${username}`;

      const response = await axios.post(url,{
        tableName: wfD.form_name,
        id: id,
      });

      const userData = response.data; 

      const { name, sign, status } = userData;

      if (status === 'Approved' || status === 'Rejected') {
        const reviewerHTML = `
          <div style="display: flex; justify-content: flex-end;">
            <div>
              <p style="text-align: left; margin: 0; font-family: 'Times New Roman', serif; font-size: 12px;">WF Review ${status} by (${name}):</p>
            </div>
            <div>
              <img src="${sign}" alt="Signature" style="width: 100px; height: 100px;"/>
            </div>
          </div>
        `;
        htmlContent += reviewerHTML; 
      }
    } catch (error) {
      console.error(`Error for username ${username}: ${error.message}`);
    }
  }
  return htmlContent; 
};


export const handleGeneratePDF = async (uid, wfD, var_myName, var_mySignature,RevSigns) => {

    const doc = new jsPDF('p', 'px');
    const str = `${uid}`;
    const [item1, item2, item3] = str.split("&");
    const response = await axios.get(`${apiUrl}/users/${item3}`);
    const data = response.data;
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(wfD.pdfContent, "text/html");
    function replaceTextInElement(element, searchText, replacementText) {
        if (element.nodeType === Node.TEXT_NODE) {
            element.nodeValue = element.nodeValue.replace(searchText, replacementText);
        } else if (element.nodeType === Node.ELEMENT_NODE) {
            for (let i = 0; i < element.childNodes.length; i++) {
                replaceTextInElement(element.childNodes[i], searchText, replacementText);
            }
        }
    }
    replaceTextInElement(htmlDoc.body, "{{ID}}", data.u_id);
    replaceTextInElement(htmlDoc.body, "{{UserName}}", data.Username);
    replaceTextInElement(htmlDoc.body, "{{Name}}", data.Fname);
    replaceTextInElement(htmlDoc.body, "{{LName}}", data.Lname);
    replaceTextInElement(htmlDoc.body, "{{Country}}", data.Country);
    replaceTextInElement(htmlDoc.body, "{{Role}}", data.Role);
    replaceTextInElement(htmlDoc.body, "{{Address}}", data.Address);
    replaceTextInElement(htmlDoc.body, "{{City}}", data.City);
    var htmlContent = htmlDoc.body.innerHTML;
    htmlContent += RevSigns;
    htmlContent += `
  <div style="display: flex; justify-content: flex-end;">
    <div>
      <p style="text-align: left; margin: 0; font-family: 'Times New Roman', serif; font-size: 12px;">Final approval (${var_myName}):</p>
    </div>
    <div>
      <img src="${var_mySignature}" alt="Signature" style="width: 100px; height: 100px;"/>
    </div>
  </div>
`;
    htmlDoc.body.innerHTML = htmlContent;
    doc.html(htmlContent, {
        callback: function (doc) {
            doc.save();
        },
        margin: [0, 0, 0, 0],
        x: 1,
        y: 1,
        width: 450, 
        windowWidth: 450, 
    });


};
