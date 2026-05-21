const sharp = require('sharp');
const path = require('path');

const svg = `<svg width="1100" height="660" viewBox="0 0 1100 660" xmlns="http://www.w3.org/2000/svg">
<rect width="1100" height="660" fill="white"/>
<defs>
  <marker id="aR" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="black"/></marker>
  <marker id="aL" markerWidth="10" markerHeight="7" refX="1" refY="3.5" orient="auto"><polygon points="10 0,0 3.5,10 7" fill="black"/></marker>
</defs>

<!-- OVAL -->
<ellipse cx="560" cy="325" rx="138" ry="278" fill="white" stroke="black" stroke-width="3"/>
<text x="560" y="333" text-anchor="middle" font-size="38" font-weight="bold" font-family="Arial" fill="black">Placify</text>

<!-- STUDENT BOX -->
<rect x="20" y="42" width="148" height="148" fill="white" stroke="black" stroke-width="2.5"/>
<text x="94" y="116" text-anchor="middle" font-size="22" font-weight="bold" font-family="Arial" fill="black">Student</text>

<!-- COMPANY BOX -->
<rect x="20" y="262" width="148" height="132" fill="white" stroke="black" stroke-width="2.5"/>
<text x="94" y="328" text-anchor="middle" font-size="22" font-weight="bold" font-family="Arial" fill="black">Company</text>

<!-- INSTITUTION BOX -->
<rect x="20" y="492" width="148" height="100" fill="white" stroke="black" stroke-width="2.5"/>
<text x="94" y="542" text-anchor="middle" font-size="20" font-weight="bold" font-family="Arial" fill="black">Institution</text>

<!-- HR BOX -->
<rect x="882" y="262" width="148" height="132" fill="white" stroke="black" stroke-width="2.5"/>
<text x="956" y="328" text-anchor="middle" font-size="22" font-weight="bold" font-family="Arial" fill="black">HR</text>

<!-- ===== STUDENT → PLACIFY ===== -->
<line x1="168" y1="60"  x2="521" y2="60"  stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="342" y="55" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Register / Login</text>

<line x1="168" y1="78"  x2="500" y2="78"  stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="332" y="73" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Apply for Jobs</text>

<line x1="168" y1="96"  x2="484" y2="96"  stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="324" y="91" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Practice (Coding / Aptitude / Interview)</text>

<line x1="168" y1="114" x2="472" y2="114" stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="318" y="109" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Submit Resume</text>

<!-- ===== PLACIFY → STUDENT ===== -->
<line x1="458" y1="132" x2="168" y2="132" stroke="black" stroke-width="1.6" marker-end="url(#aL)"/>
<text x="311" y="150" text-anchor="middle" font-size="12" font-family="Arial" fill="black">View Job Listings</text>

<line x1="452" y1="150" x2="168" y2="150" stroke="black" stroke-width="1.6" marker-end="url(#aL)"/>
<text x="308" y="168" text-anchor="middle" font-size="12" font-family="Arial" fill="black">ATS Resume Score</text>

<line x1="446" y1="168" x2="168" y2="168" stroke="black" stroke-width="1.6" marker-end="url(#aL)"/>
<text x="305" y="186" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Offer Letter</text>

<line x1="441" y1="186" x2="168" y2="186" stroke="black" stroke-width="1.6" marker-end="url(#aL)"/>
<text x="303" y="200" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Practice Results</text>

<!-- ===== COMPANY → PLACIFY ===== -->
<line x1="168" y1="280" x2="422" y2="280" stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="293" y="275" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Post Jobs</text>

<line x1="168" y1="298" x2="422" y2="298" stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="293" y="293" text-anchor="middle" font-size="12" font-family="Arial" fill="black">View Applicants</text>

<line x1="168" y1="316" x2="422" y2="316" stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="293" y="311" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Schedule Interviews</text>

<!-- ===== PLACIFY → COMPANY ===== -->
<line x1="422" y1="354" x2="168" y2="354" stroke="black" stroke-width="1.6" marker-end="url(#aL)"/>
<text x="293" y="372" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Candidate Profiles</text>

<line x1="422" y1="372" x2="168" y2="372" stroke="black" stroke-width="1.6" marker-end="url(#aL)"/>
<text x="293" y="390" text-anchor="middle" font-size="12" font-family="Arial" fill="black">AI Analysis Reports</text>

<!-- ===== INSTITUTION → PLACIFY ===== -->
<line x1="168" y1="510" x2="456" y2="510" stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="310" y="505" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Register Institution</text>

<line x1="168" y1="528" x2="462" y2="528" stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="313" y="523" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Monitor Students</text>

<!-- ===== PLACIFY → INSTITUTION ===== -->
<line x1="484" y1="560" x2="168" y2="560" stroke="black" stroke-width="1.6" marker-end="url(#aL)"/>
<text x="324" y="578" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Student Performance Reports</text>

<line x1="498" y1="578" x2="168" y2="578" stroke="black" stroke-width="1.6" marker-end="url(#aL)"/>
<text x="331" y="593" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Department Analytics</text>

<!-- ===== HR → PLACIFY ===== -->
<line x1="882" y1="280" x2="698" y2="280" stroke="black" stroke-width="1.6" marker-end="url(#aL)"/>
<text x="788" y="275" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Manage Candidates</text>

<line x1="882" y1="298" x2="698" y2="298" stroke="black" stroke-width="1.6" marker-end="url(#aL)"/>
<text x="788" y="293" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Video Call / Interview</text>

<line x1="882" y1="316" x2="698" y2="316" stroke="black" stroke-width="1.6" marker-end="url(#aL)"/>
<text x="788" y="311" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Issue Offer Letter</text>

<!-- ===== PLACIFY → HR ===== -->
<line x1="698" y1="354" x2="882" y2="354" stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="788" y="372" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Applicant Data</text>

<line x1="698" y1="372" x2="882" y2="372" stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="788" y="390" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Performance Reports</text>

<line x1="698" y1="390" x2="882" y2="390" stroke="black" stroke-width="1.6" marker-end="url(#aR)"/>
<text x="788" y="405" text-anchor="middle" font-size="12" font-family="Arial" fill="black">Job Insights</text>

<!-- TITLE -->
<text x="550" y="638" text-anchor="middle" font-size="22" font-weight="bold" font-family="Arial" letter-spacing="4" fill="black">0 - L E V E L   D F D</text>
</svg>`;

sharp(Buffer.from(svg))
  .png()
  .toFile(path.join(__dirname, 'placify_dfd_level0.png'))
  .then(() => console.log('Done!'))
  .catch(e => console.error(e));
