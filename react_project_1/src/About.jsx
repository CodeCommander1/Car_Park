import React from 'react'
import './App.css'

const About = () => {
  return (
    <section style={{padding: '1rem'}}>
      <h2>About This Component</h2>
      <div className="table-wrap">
        <table className="about-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Component Name</td>
              <td>About</td>
            </tr>
            <tr>
              <td>Purpose</td>
              <td>Show metadata and props for the component / page</td>
            </tr>
            <tr>
              <td>Props</td>
              <td>None (static). Can be extended to accept `info` object.</td>
            </tr>
            <tr>
              <td>Version</td>
              <td>1.0.0</td>
            </tr>
            <tr>
              <td>Author</td>
              <td>Ankit</td>
            </tr>
            <tr>
              <td>Last Updated</td>
              <td>2026-02-16</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default About
