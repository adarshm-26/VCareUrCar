import React from 'react';
import { Header, Footer } from './Components';
import { Container, Row, Col } from 'react-bootstrap';

export const Terms = (props) => {
  return (<>
    <Header/>
    <div style={{
      margin: '10rem auto',
    }}>
    <Container style={{
      background: 'white',
      textAlign: 'start',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'auto',
      height: '100vh',
      padding: 40,
      borderStyle: 'solid',
      borderWidth: '0.08rem',
      borderRadius: '0.2rem',
      borderColor: '#000000'
    }}>
      <Row>
        <Col>
          <h1>Terms & Conditions governing your use of this website</h1>
        </Col>
      </Row>
      <Row style={{ fontFamily: 'Source' }}>
        <ol>
          <li><strong>Introduction</strong><br/>
            These Website Standard Terms And Conditions (these “Terms” or these “Website Standard Terms And Conditions”) contained herein on this webpage, shall govern your use of this website, including all pages within this website (collectively referred to herein below as this “Website”). These Terms apply in full force and effect to your use of this Website and by using this Website, you expressly accept all terms and conditions contained herein in full. You must not use this Website, if you have any objection to any of these Website Standard Terms And Conditions.<br/>
            This Website is not for use by any minors (defined as those who are not at least 18 years of age), and you must not use this Website if you a minor.<br/>
          </li><br/>
          <li><strong>Intellectual Property Rights</strong><br/>
            Other than content you own, which you may have opted to include on this Website, under these Terms, VCareUrCar and/or its licensors own all rights to the intellectual property and material contained in this Website, and all such rights are reserved. You are granted a limited license only, subject to the restrictions provided in these Terms, for purposes of viewing the material contained on this Website.<br/>
          </li><br/>
          <li><strong>Restrictions</strong><br/>
            You are expressly and emphatically restricted from all of the following:<br/>
            <ul>
              <li>Publishing any Website material in any media;<br/></li>
              <li>Selling, sublicensing and/or otherwise commercializing any Website material;<br/></li>
              <li>Publicly performing and/or showing any Website material;<br/></li>
              <li>Using this Website in any way that is, or may be, damaging to this Website;<br/></li>
              <li>Using this Website in any way that impacts user access to this Website;<br/></li>
              <li>Using this Website contrary to applicable laws and regulations, or in a way that causes, or may cause, harm to the Website, or to any person or business entity;<br/></li>
              <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website, or while using this Website;<br/></li>
              <li>Using this Website to engage in any advertising or marketing;<br/></li>
              <li>Certain areas of this Website are restricted from access by you and VCareUrCar may further restrict access by you to any areas of this Website, at any time, in its sole and absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality of such information.<br/></li>
            </ul>
          </li><br/>
          <li><strong>Your Content</strong><br/>
            In these Website Standard Terms And Conditions, “Your Content” shall mean any audio, video, text, images or other material you choose to display on this Website. With respect to Your Content, by displaying it, you grant VCareUrCar a non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.<br/>
            Your Content must be your own and must not be infringing on any third party’s rights. VCareUrCar reserves the right to remove any of Your Content from this Website at any time, and for any reason, without notice.<br/>
          </li><br/>
          <li><strong>No warranties</strong><br/>
            This Website is provided “as is,” with all faults, and VCareUrCar makes no express or implied representations or warranties, of any kind related to this Website or the materials contained on this Website. Additionally, nothing contained on this Website shall be construed as providing consult or advice to you.<br/>
          </li><br/>
          <li><strong>Limitation of liability</strong><br/>
            In no event shall VCareUrCar , nor any of its officers, directors and employees, be liable to you for anything arising out of or in any way connected with your use of this Website, whether such liability is under contract, tort or otherwise, and VCareUrCar , including its officers, directors and employees shall not be liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.<br/>
          </li><br/>
          <li><strong>Indemnification</strong><br/>
            You hereby indemnify to the fullest extent VCareUrCar from and against any and all liabilities, costs, demands, causes of action, damages and expenses (including reasonable attorney’s fees) arising out of or in any way related to your breach of any of the provisions of these Terms.<br/>
          </li><br/>
          <li><strong>Severability</strong><br/>
            If any provision of these Terms is found to be unenforceable or invalid under any applicable law, such unenforceability or invalidity shall not render these Terms unenforceable or invalid as a whole, and such provisions shall be deleted without affecting the remaining provisions herein.<br/>
          </li><br/>
          <li><strong>Variation of Terms</strong><br/>
            VCareUrCar is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review such Terms on a regular basis to ensure you understand all terms and conditions governing use of this Website.<br/>
          </li><br/>
          <li><strong>Assignment</strong><br/>
            VCareUrCar shall be permitted to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification or consent required. However, .you shall not be permitted to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.<br/>
          </li><br/>
          <li><strong>Entire Agreement</strong><br/>
            These Terms, including any legal notices and disclaimers contained on this Website, constitute the entire agreement between VCareUrCar and you in relation to your use of this Website, and supersede all prior agreements and understandings with respect to the same.<br/>
          </li><br/>
          <li><strong>Governing Law & Jurisdiction</strong><br/>
            These Terms will be governed by and construed in accordance with the laws of the country of India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in India for the resolution of any disputes.<br/>
          </li><br/>
        </ol>
      </Row>
    </Container>
    </div>
    <Footer/>
  </>);
}