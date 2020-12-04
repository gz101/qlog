/*
 * Table of Contents
 * Section 1: Functional Components
 * Section 2: Class Components
 */


// SECTION 1: Functional Components


// Functional component for table data (individual cells)
function TableDetails(props) {
    return (
        <td id={props.id} colSpan={props.colspan}>{props.text}</td>
    )
}

// Functional component for table rows
function Project(props) {
    return (
        <tr className='table-row' onClick={() => props.loadProject()}>
            <TableDetails text={props.title} />
            <TableDetails text={props.reference} />
            <TableDetails text={props.lead} />
            <TableDetails text={props.client} />
            <TableDetails text={props.time} />
        </tr>
    )
}

// Functional component to list projects
function ProjectList(props) {
    return (
        <div id='responsive'>
            <table className='table table-hover'>
                <thead className='thead-dark'>
                    <tr>
                        <th>Project Name</th>
                        <th>Reference</th>
                        <th>Lead Engineer</th>
                        <th>Client</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    {props.projectList.map((project, index) =>
                        <Project key={index}
                            id={project.id}
                            title={project.title}
                            reference={project.ref}
                            lead={project.lead}
                            client={project.client}
                            time={project.date_created}
                            loadProject={
                                () => props.loadProject(project.id)
                            } />
                    )}
                </tbody>
            </table>
        </div>
    )
}

// Functional component to display borehole table rows
function Borehole(props) {
    return (
        <tr className='table-row' onClick={() => props.loadBorehole()}>
            <TableDetails text={props.reference} />
            <TableDetails text={props.logger} />
            <TableDetails text={props.date} />
            <TableDetails text={props.equipment} />
        </tr>
    )
}

// Functional component to display boreholes in a project
function ProjectView(props) {

    // If there are boreholes for this project
    if (props.boreholes.length > 0) {
        return (
            <div>
                <h5>Project Boreholes</h5>
                <div id='responsive'>
                    <table className='table table-hover'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>Borehole Reference</th>
                                <th>Logger</th>
                                <th>Created</th>
                                <th>Equipment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.boreholes.map((borehole, index) =>
                                <Borehole key={index}
                                    id={borehole.id}
                                    reference={borehole.ref}
                                    date={borehole.date_created}
                                    equipment={borehole.equipment}
                                    logger={borehole.logger}
                                    loadBorehole={
                                        () => props.loadBorehole(borehole.id)
                                    } />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )

    // If no boreholes for this project yet
    } else {
        return (
            <div>
                <h5>Project Boreholes</h5>
                <div id='responsive'>
                    <table className='table table-hover'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>Borehole Reference</th>
                                <th>Logger</th>
                                <th>Created</th>
                                <th>Equipment</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan='4'>
                                    No boreholes recorded yet.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

// Functional component for displaying text in a div
function ProjectText(props) {
    return (
        <div className={props.style}>{props.start}{props.text}</div>
    )
}

// Functional component for displaying a link within a div
function UserLink(props) {
    return(
        <div className={props.style}>
            {props.start}
            <a onClick={() => props.loadProfile()} href='#'>
                {props.text}
            </a>
        </div>
    )
}

// Functional component for displaying a jumbotron for every project
function ProjectDetails(props) {
    return (
        <div id='project-details' className='jumbotron'>
            <ProjectText style='h2'
                start='Project Ref: '
                text={props.projects.ref} />

            <ProjectText style='lead' text={props.projects.title} />

            <ProjectText style='lead' text={props.projects.description} />

            <hr className='my-4'></hr>

            <UserLink start='Lead Engineer: '
                leadId={props.projects.lead_id}
                text={props.projects.lead}
                loadProfile={
                    () => props.loadProfile(props.projects.lead_id)
                } />

            <ProjectText start='Client: ' text={props.projects.client} />

            <ProjectText start='Created: '
                text={props.projects.date_created} />
        </div>
    )
}

// Functional component to display the projects for user
function ProfileView(props) {

    // Check if user is both leading and logging for projects
    if (props.projectsLeading.length > 0
        && props.projectsLogging.length > 0) {

        return (
            <div>
                <h3>Profile: {props.user}</h3>
                <hr></hr><br></br>

                <h5>Projects {props.user} is leading</h5>

                <ProjectList projectList={props.projectsLeading}
                    loadProject={props.loadProject} />

                <br></br>
                <h5>Projects {props.user} is logging boreholes for</h5>

                <ProjectList projectList={props.projectsLogging}
                    loadProject={props.loadProject} />
            </div>
        )

    // If user is only leading projects
    } else if (props.projectsLeading.length > 0
                && props.projectsLogging.length === 0) {

        return (
            <div>
                <h3>Profile: {props.user}</h3>
                <hr></hr><br></br>

                <h5>Projects {props.user} is leading</h5>

                <ProjectList projectList={props.projectsLeading}
                    loadProject={props.loadProject} />

                <br></br>
                <h5>
                    {props.user} is not logging boreholes for any project yet.
                </h5>
            </div>
        )

    // If user is only logging boreholes for projects
    } else if (props.projectsLeading.length === 0
                && props.projectsLogging.length > 0) {

        return (
            <div>
                <h3>Profile: {props.user}</h3>
                <hr></hr><br></br>

                <h5>{props.user} is not leading any projects currently.</h5>
                <br></br>

                <h5>Projects {props.user} is logging boreholes for</h5>

                <ProjectList projectList={props.projectsLogging}
                    loadProject={props.loadProject} />
            </div>
        )

    // If user is not leading or logging for any projects
    } else {

        return (
            <div>
                <h3>Profile: {props.user}</h3>
                <hr></hr><br></br>

                <h6>{props.user} is not leading any projects currently.</h6>
                <br></br>

                <h6>
                    {props.user} is not logging boreholes for any project yet.
                </h6>
            </div>
        )
    }
}

// Functional component showing details of each borehole
function BoreholeTop(props) {
    return (
        <div id='responsive'>
            <table id='borehole-details' className='table table-bordered'>
                <thead className='thead-dark'>
                    <tr>
                        <th colSpan='2'>qLog</th>
                        <th colSpan='4'>
                            Borehole Ref: {props.borehole.ref}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <TableDetails text='Project Ref:' />

                        <TableDetails text={props.borehole.project_ref} />

                        <TableDetails text='Project Title:' />

                        <TableDetails colspan='3'
                            text={props.borehole.project} />
                    </tr>
                    <tr>
                        <TableDetails text='Date Created:' />

                        <TableDetails text={props.borehole.date_created} />

                        <TableDetails text='Client:' />

                        <TableDetails colspan='3'
                            text={props.borehole.project_client} />
                    </tr>
                    <tr>
                        <TableDetails text='Northing:' />

                        <TableDetails text={props.borehole.northing} />

                        <TableDetails text='Drilling Equipment:' />

                        <TableDetails text={props.borehole.equipment} />

                        <TableDetails text='Drilling Diameter (mm):' />

                        <TableDetails text={props.borehole.bh_dia} />
                    </tr>
                    <tr>
                        <TableDetails text='Easting:' />

                        <TableDetails text={props.borehole.easting} />

                        <TableDetails text='Ground Level (m):' />

                        <TableDetails text={props.borehole.ground_level} />

                        <TableDetails text='Logger:' />

                        <td>
                            <a onClick={
                                () => props.loadProfile(
                                    props.borehole.logger_id)}
                                href='#'>
                                {props.borehole.logger}
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

// Functional component for each geology layer (table row)
function Strata(props) {
    return (
        <tr>
            <TableDetails text={props.date} />

            <TableDetails text={props.start} />

            <TableDetails text={props.end} />

            <TableDetails text={props.sample} />

            <TableDetails text={props.fieldTest} />

            <TableDetails text={props.spt} />

            <TableDetails colspan='2' text={props.description} />

            <td id='edit-layer-btn'>
                <a onClick={
                    () => props.editStrata(props.boreholeId, props.id)}
                    id='edit-layer-link'
                    href='#'>
                    &#9998;
                </a>
            </td>
        </tr>
    )
}

// Functional component for table showing geology layers
function BoreholeMid(props) {

    // If there are geology layers
    if (props.geology.length > 0) {

        return (
            <div id='responsive'>
                <table className='table table-bordered table-sm'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>Logged</th>
                            <th>Start (m)</th>
                            <th>End (m)</th>
                            <th>Sample</th>
                            <th>Field Test</th>
                            <th>SPT 'N'</th>
                            <th colSpan='2'>Description</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.geology.map((layer, index) =>

                            <Strata key={index}
                                id={layer.id}
                                date={layer.timestamp}
                                boreholeId={props.borehole.id}
                                start={layer.start_depth}
                                end={layer.end_depth}
                                sample={layer.sample_id}
                                fieldTest={layer.field_test}
                                spt={layer.spt}
                                description={layer.description}
                                editStrata={props.editStrata} />

                        )}
                    </tbody>
                </table>
            </div>
        )

    // No layers recorded yet
    } else {

        return (
            <div id='responsive'>
                <table className='table table-bordered table-sm'>
                    <thead className='thead-dark'>
                        <tr>
                            <th>Logged</th>
                            <th>Start (m)</th>
                            <th>End (m)</th>
                            <th>Sample</th>
                            <th>Field Test</th>
                            <th>SPT 'N'</th>
                            <th colSpan='2'>Description</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan='9'>No layers recorded yet.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

// Functional component containing everything in each borehole page
function BoreholeView(props) {
    return (
        <div>
            <h3>Borehole Ref: {props.borehole.ref}</h3>

            <BoreholeTop loadProfile={props.loadProfile}
                borehole={props.borehole} />

            <button id='edit-borehole-btn'
                className='btn btn-dark'
                onClick={() => props.newForm('editBorehole')}>
                Edit Details
            </button>

            <NewBoreholeForm id={props.borehole.id}
                reference={props.borehole.ref}
                northing={props.borehole.northing}
                easting={props.borehole.easting}
                groundLevel={props.borehole.ground_level}
                equipment={props.borehole.equipment}
                diameter={props.borehole.bh_dia}
                loadBorehole={props.loadBorehole}
                purposeFlag='edit' />

            <BoreholeMid geology={props.geology}
                borehole={props.borehole}
                newForm={props.newForm}
                editStrata={props.editStrata} />
        </div>
    )
}

// Functional component showing each user and projects involved in
function UserRow(props) {
    return (
        <tr className='table-row' onClick={() => props.loadProfile()}>

            <TableDetails text={props.username} />

            <TableDetails text={props.leading} />

            <TableDetails text={props.logging} />
        </tr>
    )
}

// Functional component which shows all users and the projects involved in
function AllProfileView(props) {
    return (
        <div id='responsive'>
            <table className='table table-hover'>
                <thead className='thead-dark'>
                    <tr>
                        <th>Username</th>
                        <th>Projects Leading</th>
                        <th>Projects Logging</th>
                    </tr>
                </thead>
                <tbody>
                    {props.users.map((user, index) =>

                        <UserRow key={index}
                            id={user.id}
                            username={user.username}
                            leading={user.projects}
                            logging={user.boreholes}
                            loadProfile={() => props.loadProfile(user.id)} />

                    )}
                </tbody>
            </table>
        </div>
    )
}

// Functional component for each input field of a form
function FormGroupText(props) {
    return (
        <div>
            <label>{props.label}</label>
            <input id={props.id} name={props.name}
                className='form-control'
                value={props.value}
                onChange={props.handleChange} />
        </div>
    )
}

// Functional component for each Textarea of a form
function FormGroupTextArea(props) {
    return (
        <div>
            <label>{props.label}</label>
            <textarea id={props.id}
                name={props.name}
                className='form-control'
                value={props.value}
                onChange={props.handleChange} />
        </div>
    )    
}

// Functional component to display user message
function Message(props) {
    return (
        <div className='message'>
            <div>{props.message}</div>

            <UserLink leadId={props.userId}
                text={props.user}
                loadProfile={() => props.loadProfile(props.userId)} />

            <div className='message-time'>{props.date}</div>
        </div>
    )
}

// Functional component listing all existing messages
function MessageList(props) {
    return (
        <div>
            {props.messages.map((message, index) =>

                <Message key={index}
                    message={message.message}
                    date={message.date}
                    userId={message.user_id}
                    user={message.user}
                    loadProfile={props.loadProfile} />

            )}
        </div>
    )
}

// Functional component for using pagination
function Pagination(props) {

    // If current page is in the middle
    if (props.hasPrev && props.hasNext) {

        return (
            <nav className='nav-pagination'>
                <ul className='pagination'>
                    <div className='prev'>
                        <li id='prev-btn' className='page-item'>
                            <a className='page-link'
                                href='#'
                                onClick={
                                    () => props.loadPage(
                                        props.projectId, props.current - 1)}>
                                Previous
                            </a>
                        </li>
                    </div>
                    <div className='next'>
                        <li id='next-btn' className='page-item'>
                            <a className='page-link'
                                href='#'
                                onClick={
                                    () => props.loadPage(
                                        props.projectId, props.current + 1)}>
                                Next
                            </a>
                        </li>
                    </div>
                </ul>
            </nav>
        )

    // If current page is the last page
    } else if (props.hasPrev && !props.hasNext) {

        return (
            <nav className='nav-pagination'>
                <ul className='pagination'>
                    <div className='prev'>
                        <li id='prev-btn' className='page-item'>
                            <a className='page-link'
                                href='#'
                                onClick={
                                    () => props.loadPage(
                                        props.projectId, props.current - 1)}>
                                Previous
                            </a>
                        </li>
                    </div>
                    <div className='next'>
                        <li id='next-btn' className='page-item disabled'>
                            <a className='page-link' href='#'>Next</a>
                        </li>
                    </div>
                </ul>
            </nav>
        )

    // If current page is the first page
    } else if (!props.hasPrev && props.hasNext) {

        return (
            <nav className='nav-pagination'>
                <ul className='pagination'>
                    <div className='prev'>
                        <li id='prev-btn' className='page-item disabled'>
                            <a className='page-link' href='#'>Previous</a>
                        </li>
                    </div>
                    <div className='next'>
                        <li id='next-btn' className='page-item'>
                            <a className='page-link'
                                href='#'
                                onClick={
                                    () => props.loadPage(
                                        props.projectId, props.current + 1)}>
                                Next
                            </a>
                        </li>
                    </div>
                </ul>
            </nav>
        )

    // If there is only one page
    } else {

        return (
            <nav className='nav-pagination'>
                <ul className='pagination'>
                    <div className='prev'>
                        <li id='prev-btn' className='page-item disabled'>
                            <a className='page-link' href='#'>Previous</a>
                        </li>
                    </div>
                    <div className='next'>
                        <li id='next-btn' className='page-item disabled'>
                            <a className='page-link' href='#'>Next</a>
                        </li>
                    </div>
                </ul>
            </nav>
        )
    }
}

// Functional component for rendering image on homepage
function IntroImg() {

    // Uses a temporary link to source img for now - TBC for deployment
    return (
        <div id='greeting-img'>
            <img src='http://127.0.0.1:8000/media/images/greeting.jpg'></img>
        </div>
    )
}

// Functional component for displaying the canvas for sketching 
function Canvas() {
    return (
        <div id='canvas-container'>
            <canvas width='425px' height='300px' id='canvas' />
        </div>
    )
}

// Helper function to get CSRF token
// Credits to: https://stackoverflow.com/questions/47477060/
function getCookie(name) {
    if (!document.cookie) {
    return null;
    }

    const token = document.cookie.split(';')
    .map(c => c.trim())
    .filter(c => c.startsWith(name + '='));

    if (token.length === 0) {
    return null;
    }

    return decodeURIComponent(token[0].split('=')[1]);
}


// Class component form for editing and creating new geology layer
class NewLayerForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            style: {'display': 'none'},
            startDepth: '',
            endDepth: '',
            sample: '',
            spt: '',
            fieldTest: '',
            description: '',
            purposeFlag: this.props.purposeFlag
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderNew = this.renderNew.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            startDepth: nextProps.start,
            endDepth: nextProps.end,
            sample: nextProps.sample,
            spt: nextProps.spt,
            fieldTest: nextProps.field,
            description: nextProps.description
        });
    }

    // Handle changes in form input fields
    handleChange(event) {
        const value = event.target.value;

        this.setState({
            ...this.state,
            [event.target.name]: value
        });
    }

    // Handles form submission to server (new layer)
    handleSubmit(event) {
        event.preventDefault();

        const csrftoken = getCookie('csrftoken');

        fetch(`/geology/${this.props.borehole.id}/0`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                start_depth: this.state.startDepth,
                end_depth: this.state.endDepth,
                sample_number: this.state.sample,
                spt_result: this.state.spt,
                field_test_details: this.state.fieldTest,
                geology_description: this.state.description
            })
        })
        .then(response => response.json())
        .then(res => {

            // Handles any errors during form submission
            if (res.error) {
                throw new Error(res.error);

            } else {
                this.setState({
                    startDepth: '',
                    endDepth: '',
                    sample: '',
                    spt: '',
                    fieldTest: '',
                    description: ''
                });

                // Hide form after successful submission
                document.querySelector('#new-layer-form').style.display = 'none';
                document.querySelector('#new-layer-btn').style.display = 'block';
                this.props.loadBorehole(this.props.borehole.id);
            }
        })
        .catch(error => {
            alert(error);
        });
    }

    // Handles form submission to server (edit layer)
    handleSave(event) {
        event.preventDefault();

        const csrftoken = getCookie('csrftoken');

        fetch(`/geology/${this.props.borehole.id}/${this.props.id}`, {
            method: 'PUT',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                start_depth: this.state.startDepth,
                end_depth: this.state.endDepth,
                sample_number: this.state.sample,
                spt_result: this.state.spt,
                field_test_details: this.state.fieldTest,
                geology_description: this.state.description
            })
        })
        .then(response => response.json())
        .then(res => {

            // Handles any errors in form submission
            if (res.error) {
                throw new Error(res.error);
            }

            // Hide form after successful submission
            document.querySelector('#edit-layer-form').style.display = 'none';
            document.querySelector('#new-layer-btn').style.display = 'block';
            this.props.loadBorehole(this.props.borehole.id);
        })
        .catch(error => {
            alert(error);
        });
    }

    // Renders form for new geology layer creation
    renderNew() {
        return (
            <div style={this.state.style} id='new-layer-form'>
                <br />
                <h5>Add New Layer</h5>

                <form onSubmit={this.handleSubmit}>
                    <FormGroupText name='startDepth'
                        value={this.state.startDepth}
                        label='Start Depth (m)'
                        handleChange={this.handleChange} />

                    <FormGroupText name='endDepth'
                        value={this.state.endDepth}
                        label='End Depth (m)'
                        handleChange={this.handleChange} />

                    <FormGroupText name='sample'
                        value={this.state.sample}
                        label='Sample Ref'
                        handleChange={this.handleChange} />

                    <FormGroupText name='spt'
                        value={this.state.spt}
                        label='SPT N Value'
                        handleChange={this.handleChange} />

                    <FormGroupText name='fieldTest'
                        value={this.state.fieldTest}
                        label='Field Test'
                        handleChange={this.handleChange} />

                    <FormGroupText name='description'
                        value={this.state.description}
                        label='Description'
                        handleChange={this.handleChange} />

                    <button className='btn btn-dark' type='submit'>
                        Submit
                    </button>
                </form>
            </div>
        )
    }

    // Renders form for editing geology layer
    renderEdit() {
        return (
            <div style={this.state.style} id='edit-layer-form'>
                <br />
                <h5>Edit Layer</h5>

                <form onSubmit={this.handleSave}>
                    <FormGroupText name='startDepth'
                        id='layer-start'
                        value={this.state.startDepth}
                        label='Start Depth (m)'
                        handleChange={this.handleChange} />

                    <FormGroupText name='endDepth'
                        id='layer-end'
                        value={this.state.endDepth}
                        label='End Depth (m)'
                        handleChange={this.handleChange} />

                    <FormGroupText name='sample'
                        id='layer-sample'
                        value={this.state.sample}
                        label='Sample Ref'
                        handleChange={this.handleChange} />

                    <FormGroupText name='spt'
                        id='layer-spt'
                        value={this.state.spt}
                        label='SPT N Value'
                        handleChange={this.handleChange} />

                    <FormGroupText name='fieldTest'
                        id='layer-field'
                        value={this.state.fieldTest}
                        label='Field Test'
                        handleChange={this.handleChange} />

                    <FormGroupText name='description'
                        id='layer-description'
                        value={this.state.description}
                        label='Description'
                        handleChange={this.handleChange} />

                    <button className='btn btn-dark' type='submit'>
                        Save
                    </button>
                </form>
            </div>
        )
    }

    // Conditional to decide whether to show edit or new form
    render() {
        if (this.state.purposeFlag === 'edit') {
            return this.renderEdit();
        } else {
            return this.renderNew();
        }
    }
}


// SECTION 2: Class Components


// Class component form for editing exisitng and creating new borehole
class NewBoreholeForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            style: {'display': 'none'},
            id: this.props.id,
            reference: this.props.reference,
            northing: this.props.northing,
            easting: this.props.easting,
            groundLevel: this.props.groundLevel,
            equipment: this.props.equipment,
            diameter: this.props.diameter,
            purposeFlag: this.props.purposeFlag
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderNew = this.renderNew.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    // Handles changes to form input fields
    handleChange(event) {
        const value = event.target.value;

        this.setState({
            ...this.state,
            [event.target.name]: value
        });
    }

    // Handles saving edits to existing borehole
    handleSave(event) {
        event.preventDefault();

        const csrftoken = getCookie('csrftoken');

        fetch(`/borehole/${this.props.id}`, {
            method: 'PUT',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                borehole_reference: this.state.reference,
                borehole_northing: this.state.northing,
                borehole_easting: this.state.easting,
                ground_level: this.state.groundLevel,
                drilling_equipment: this.state.equipment,
                borehole_diameter: this.state.diameter
            })
        })
        .then(response => response.json())
        .then(res => {

            // Handles any errors from server
            if (res.error) {
                throw new Error(res.error);
            }

            // Hide form after successful submission
            document.querySelector('#new-borehole-form').style.display = 'none';
            document.querySelector('#edit-borehole-btn').style.display = 'block';
            this.props.loadBorehole(this.props.id);
        })
        .catch(error => {
            alert(error);
        });
    }

    // Handles submission of form for new borehole
    handleSubmit(event) {
        event.preventDefault();

        const csrftoken = getCookie('csrftoken');

        fetch(`/borehole/0`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                projectId: this.props.project.id,
                borehole_reference: this.state.reference,
                borehole_northing: this.state.northing,
                borehole_easting: this.state.easting,
                ground_level: this.state.groundLevel,
                drilling_equipment: this.state.equipment,
                borehole_diameter: this.state.diameter
            })
        })
        .then(response => response.json())
        .then(res => {

            // Handles server errors
            if (res.error) {
                throw new Error(res.error);

            } else {
                this.setState({
                    reference: '',
                    northing: '',
                    easting: '',
                    groundLevel: '',
                    equipment: '',
                    diameter: ''
                })

                // Hide form after successful submission
                document.querySelector('#new-borehole-form').style.display = 'none';
                document.querySelector('#new-borehole-btn').style.display = 'block';
                this.props.loadProject(this.props.project.id);
            }
        })
        .catch(error => {
            alert(error);
        })
    }

    // Renders view for creating new borehole
    renderNew() {
        return (
            <div style={this.state.style} id='new-borehole-form'>
                <br />
                <h5>Create New Borehole</h5>

                <form onSubmit={this.handleSubmit}>
                    <FormGroupText name='reference'
                        value={this.state.reference}
                        label='Borehole Ref'
                        handleChange={this.handleChange} />

                    <FormGroupText name='northing'
                        value={this.state.northing}
                        label='Northing'
                        handleChange={this.handleChange} />

                    <FormGroupText name='easting'
                        value={this.state.easting}
                        label='Easting'
                        handleChange={this.handleChange} />

                    <FormGroupText name='groundLevel'
                        value={this.state.groundLevel}
                        label='Ground Level (m)'
                        handleChange={this.handleChange} />

                    <FormGroupText name='equipment'
                        value={this.state.equipment}
                        label='Drilling Equipment'
                        handleChange={this.handleChange} />

                    <FormGroupText name='diameter'
                        value={this.state.diameter}
                        label='Drilling Diameter (mm)'
                        handleChange={this.handleChange} />

                    <button className='btn btn-dark' type='submit'>
                        Submit
                    </button>
                </form>
            </div>
        )
    }

    // Renders forms for editing existing borehole details
    renderEdit() {
        return (
            <div style={this.state.style} id='new-borehole-form'>
                <br />
                <h5>Edit Borehole</h5>

                <form onSubmit={this.handleSave}>
                    <FormGroupText name='reference'
                        value={this.state.reference}
                        label='Borehole Ref'
                        handleChange={this.handleChange} />

                    <FormGroupText name='northing'
                        value={this.state.northing}
                        label='Northing'
                        handleChange={this.handleChange} />

                    <FormGroupText name='easting'
                        value={this.state.easting}
                        label='Easting'
                        handleChange={this.handleChange} />

                    <FormGroupText name='groundLevel'
                        value={this.state.groundLevel}
                        label='Ground Level (m)'
                        handleChange={this.handleChange} />

                    <FormGroupText name='equipment'
                        value={this.state.equipment}
                        label='Drilling Equipment'
                        handleChange={this.handleChange} />

                    <FormGroupText name='diameter'
                        value={this.state.diameter}
                        label='Drilling Diameter (mm)'
                        handleChange={this.handleChange} />

                    <button className='btn btn-dark' type='submit'>
                        Save
                    </button>
                </form>
            </div>
        )
    }

    // Conditional to decide if editing or creating new borehole
    render() {
        if (this.state.purposeFlag === 'edit') {
            return this.renderEdit();
        } else {
            return this.renderNew();
        }
    }
}


// Class component for forms to handle creating and editing projects
class NewProjectForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            style: {'display': 'none'},
            id: this.props.id,
            title: this.props.title,
            reference: this.props.reference,
            client: this.props.client,
            description: this.props.description,
            purposeFlag: this.props.purposeFlag
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderNew = this.renderNew.bind(this);
        this.renderEdit = this.renderEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    // Handles changes to form input fields
    handleChange(event) {
        const value = event.target.value;

        this.setState({
            ...this.state,
            [event.target.name]: value
        });
    }

    // Handles saving of edits made to existing project
    handleSave(event) {
        event.preventDefault();
        const csrftoken = getCookie('csrftoken');

        fetch(`/projects/${this.state.id}/1`, {
            method: 'PUT',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                project_title: this.state.title,
                project_reference: this.state.reference,
                project_client: this.state.client,
                project_description: this.state.description
            })
        })
        .then(response => response.json())
        .then(res => {

            // Handles errors from server
            if (res.error) {
                throw new Error(res.error);
            }

            // Hide form after successful submission
            document.querySelector('#new-project-form').style.display = 'none';
            document.querySelector('#edit-project-btn').style.display = 'block';
            document.querySelector('#project-details').style.display = 'block';
            this.props.loadProject(this.props.id, 1);
        })
        .catch(error => {
            alert(error);
        });
    }

    // Handles submission of form for new project
    handleSubmit(event) {
        event.preventDefault();

        const csrftoken = getCookie('csrftoken');

        fetch(`/projects/${0}/1`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                project_title: this.state.title,
                project_reference: this.state.reference,
                project_client: this.state.client,
                project_description: this.state.description
            })
        })
        .then(response => response.json())
        .then(res => {

            // Handles serverside errors
            if (res.error) {
                throw new Error (res.error);

            } else {
                this.setState({
                    title: '',
                    reference: '',
                    client: '',
                    description: ''
                })

                // Hide form after successful submission
                document.querySelector('#new-project-form').style.display = 'none';
                document.querySelector('#new-project-btn').style.display = 'block';
                this.props.loadNavPage('home');
            }
        })
        .catch(error => {
            alert(error);
        });
    }

    // Renders view for creating new project form
    renderNew() {
        return (
            <div style={this.state.style} id='new-project-form'>
                <br />
                <h5>Create New Project</h5>

                <form onSubmit={this.handleSubmit}>
                    <FormGroupText name='title'
                        value={this.state.title}
                        label='Project Title'
                        handleChange={this.handleChange} />

                    <FormGroupText name='reference'
                        value={this.state.reference}
                        label='Project Reference'
                        handleChange={this.handleChange} />

                    <FormGroupText name='client'
                        value={this.state.client}
                        label='Project Client'
                        handleChange={this.handleChange} />

                    <FormGroupTextArea name='description'
                        value={this.state.description}
                        label='Project Description'
                        handleChange={this.handleChange} />

                    <button className='btn btn-dark' type='submit'>
                        Submit
                    </button>
                </form>
            </div>
        )
    }

    // Renders view for editing existing project form
    renderEdit() {
        return (
            <div style={this.state.style} id='new-project-form'>
                <br />
                <h5>Edit Project: {this.state.reference}</h5>

                <form onSubmit={this.handleSave}>
                    <FormGroupText name='title'
                        value={this.state.title}
                        label='Project Title'
                        handleChange={this.handleChange} />

                    <FormGroupText name='reference'
                        value={this.state.reference}
                        label='Project Reference'
                        handleChange={this.handleChange} />

                    <FormGroupText name='client'
                        value={this.state.client}
                        label='Project Client'
                        handleChange={this.handleChange} />

                    <FormGroupTextArea name='description'
                        value={this.state.description}
                        label='Project Description'
                        handleChange={this.handleChange} />

                    <button className='btn btn-dark' type='submit'>
                        Save
                    </button>
                </form>
            </div>
        )
    }

    // Conditional to decide whether to render edit or new form
    render() {
        if (this.state.purposeFlag === 'edit') {
            return this.renderEdit();
        } else {
            return this.renderNew();
        }
    }
}


// Class component to handle sketching and saving to server
class Sketch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dragging: false,
            projectId: this.props.id,
            previousSketch: false,
            imgURL: ''
        }
        this.putPoint = this.putPoint.bind(this);
        this.engage = this.engage.bind(this);
        this.disengage = this.disengage.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.loadPreviousImg = this.loadPreviousImg.bind(this);
        this.renderPreviousSketch = this.renderPreviousSketch.bind(this);
        this.renderNewSketch = this.renderNewSketch.bind(this);
    }

    componentDidMount() {
        var canvas = document.querySelector('#canvas');

        canvas.addEventListener('mousemove', this.putPoint);
        canvas.addEventListener('mousedown', this.engage);
        canvas.addEventListener('mouseup', this.disengage);

        this.loadPreviousImg();
    }

    // Check if any previous sketches for this project
    loadPreviousImg() {
        fetch(`/sketch/${this.state.projectId}`)
        .then(response => response.json())
        .then(data => {

            // Handles any errors from server
            if (data.error) {
                throw new Error(data.error);
            }

            // Message only returned if no previous sketch
            if (!data.message) {

                this.setState({
                    previousSketch: true
                });

                this.setState({
                    imgURL: data.img
                });

                var canvas = document.querySelector('#canvas');
                var context = canvas.getContext('2d');

                // Draw previous sketch onto canvas
                var background = new Image();
                background.src = data.img;

                // Add event listeners on top of drawn canvas
                background.onload = () => {
                    context.drawImage(background, 0, 0);
                    canvas.addEventListener('mousemove', this.putPoint);
                    canvas.addEventListener('mousedown', this.engage);
                    canvas.addEventListener('mouseup', this.disengage);
                }
            }
        })
        .catch(error => {
            alert(error);
        });
    }

    // Click on mouse - start drawing
    engage(event) {
        this.setState({
            dragging: true,
        });

        // Allow single points
        this.putPoint(event);
    }

    // Mouse up - stop drawing
    disengage() {
        this.setState({
            dragging: false
        });

        var canvas = document.querySelector('#canvas');
        var context = canvas.getContext('2d');

        // Don't connect to previous point if mouse up
        context.beginPath();
    }

    // Add a point to drawing canvas
    putPoint(event) {

        // Get coordinates of mouse click
        // Credits to https://stackoverflow.com/a/9961416/13890191
        // I made some edits to suit React rather than Javascript
        var totalOffsetX = 0;
        var totalOffsetY = 0;
        var canvasX = 0;
        var canvasY = 0;
        var currentElement = event.target;
        var canvas = event.target;

        do {
            totalOffsetX += currentElement.offsetLeft;
            totalOffsetY += currentElement.offsetTop;
        }
        while (currentElement = currentElement.offsetParent)
    
        canvasX = event.pageX - totalOffsetX;
        canvasY = event.pageY - totalOffsetY;

        canvasX = Math.round(canvasX * (canvas.width / canvas.offsetWidth));
        canvasY = Math.round(canvasY * (canvas.height / canvas.offsetHeight));

        // End of stackoverflow mouse click location solution

        // Conditional to determine whether to place point
        if (this.state.dragging) {

            var canvas = document.querySelector('#canvas');
            var context = canvas.getContext('2d');

            // Thickness of drawing point
            context.lineWidth = 6;

            // Path to previous point
            context.lineTo(canvasX, canvasY);
            context.stroke();

            // Draw circle (single point)
            context.beginPath();
            context.arc(canvasX, canvasY, 3, Math.PI*2, false);
            context.fill();

            // Draw connecting line between circles (smoother look)
            context.beginPath();
            context.moveTo(canvasX, canvasY);
        }
    }

    // Handles saving to canvas
    saveCanvas() {
        var canvas = document.querySelector('#canvas');
        var data = canvas.toDataURL('image/png');

        const csrftoken = getCookie('csrftoken');

        fetch(`/sketch/${this.state.projectId}`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                dataURI: data
            })
        })
        .then(response => response.json())
        .then(res => {

            // Handles any errors from server
            if (res.error) {
                throw new Error(res.error);
            }

            this.props.loadProject(this.state.projectId);
        })
        .catch(error => {
            alert(error);
        });
    }

    // Clear the canvas
    clearCanvas() {
        var canvas = document.querySelector('#canvas');
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // If there have been previous sketches
    renderPreviousSketch() {
        return (
            <div id='sketch-canvas'>
                <h5>Project Sketch</h5>
                <p>Previous saved sketch is loaded:</p>

                <Canvas />

                <div>
                    <button className='btn btn-dark'
                        onClick={() => this.saveCanvas()}>
                        Save
                    </button>
                    <button className='btn btn-warning'
                        onClick={() => this.clearCanvas()}>
                        Clear
                    </button>
                </div>
            </div>
        )
    }

    // If no previous sketches
    renderNewSketch() {
        return (
            <div id='sketch-canvas'>
                <h5>Project Sketch</h5>

                <Canvas />

                <div>
                    <button className='btn btn-dark'
                        onClick={() => this.saveCanvas()}>
                        Save
                    </button>
                    <button className='btn btn-warning'
                        onClick={() => this.clearCanvas()}>
                        Clear
                    </button>
                </div>
            </div>
        )
    }

    // Conditional to decide what to show if there are previous sketches
    render() {
        if (this.state.previousSketch) {
            return this.renderPreviousSketch();
        } else {
            return this.renderNewSketch();
        }
    }
}


// Class component for form to add new messages to message board
class MessageForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            projectId: this.props.id,
            message: '',
            messages: [],
            currentPage: '',
            totalPages: '',
            hasPrev: false,
            hasNext: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadMessages = this.loadMessages.bind(this);
    }

    componentDidMount() {
        this.loadMessages(this.state.projectId);
    }

    // Load previous messages
    loadMessages(pageNumber=1) {
        fetch(`/message/${this.state.projectId}/${pageNumber}`)
        .then(response => response.json())
        .then(data => {

            // Handles any errors from the server
            if (data.error) {
                throw new Error(data.error);
            }

            // Pagination to organize messages
            this.setState({
                messages: data.messages,
                totalPages: data.total_pages,
                currentPage: data.current_page,
                hasPrev: data.has_prev,
                hasNext: data.has_next
            });
        })
        .catch(error => {
            alert(error);
        });
    }

    // Handles changes in message input field
    handleChange(event) {
        this.setState({
            message: event.target.value
        });
    }

    // Handles submission of form for creating new message
    handleSubmit(event) {
        event.preventDefault();

        const csrftoken = getCookie('csrftoken');

        fetch(`/message/${this.state.projectId}/0`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                message: this.state.message
            })
        })
        .then(response => response.json())
        .then(res => {

            // Handles errors from server
            if (res.error) {
                throw new Error(res.error);
            }

            this.loadMessages();
            this.setState({
                message: ''
            });
        })
        .catch(error => {
            alert(error);
        });
    }

    // Renders the message section (including form)
    render() {
        return (
            <div>
                <h4>Message Board</h4>

                <form onSubmit={this.handleSubmit}>

                    <FormGroupTextArea value={this.state.message}
                        name='message'
                        label='Add your message here:'
                        handleChange={this.handleChange} />

                    <button className='btn btn-dark' type='submit'>
                        Post
                    </button>
                </form>

                <MessageList messages={this.state.messages}
                    loadProfile={this.props.loadProfile} />

                <Pagination projectId={this.state.projectId}
                    total={this.state.totalPages}
                    current={this.state.currentPage}
                    hasPrev={this.state.hasPrev}
                    hasNext={this.state.hasNext}
                    loadPage={this.loadMessages} />
            </div>
        )
    }
}


// Class component which ties everything together
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 'home',
            projects: [],
            boreholes: [],
            projectsLeading: [],
            projectsLogging: [],
            user: '',
            geology: [],
            strata: [],
            users: [],
            style: {display:'block'},
            totalPages: '',
            currentPage: '',
            hasPrev: false,
            hasNext: false
        }

        // Bind the functions used in this class
        this.loadProject = this.loadProject.bind(this);
        this.renderAllProjects = this.renderAllProjects.bind(this);
        this.renderProject = this.renderProject.bind(this);
        this.loadNavPage = this.loadNavPage.bind(this);
        this.loadProfile = this.loadProfile.bind(this);
        this.renderProfile = this.renderProfile.bind(this);
        this.loadBorehole = this.loadBorehole.bind(this);
        this.renderBorehole = this.renderBorehole.bind(this);
        this.loadGeology = this.loadGeology.bind(this);
        this.newForm = this.newForm.bind(this);
        this.renderAllUsers = this.renderAllUsers.bind(this);
        this.editStrata = this.editStrata.bind(this);
    }

    // Add event listeners once page is loaded
    componentDidMount() {
        this.loadNavPage();
        document.querySelector('#nav-profile').addEventListener('click', () => this.loadNavPage('profile'));
        document.querySelector('#nav-users').addEventListener('click', () => this.loadNavPage('users'));
        document.querySelector('#nav-projects').addEventListener('click', () => this.loadNavPage('home'));
    }

    // Function decides how to handle clicks on nav bar links
    loadNavPage(page, pageNumber=1) {

        // If individual profile page is requested
        if (page === 'profile') {

            var profileLink = document.querySelector('#nav-profile');
            var userId = profileLink.getAttribute('data-user');
            this.loadProfile(userId);

        // If all users page is requested
        } else if (page === 'users') {

            fetch(`/profile/0`)
            .then(response => response.json())
            .then(users => {

                // Handles error from server
                if (users.error) {
                    throw new Error(users.error);
                }

                this.setState({
                    page: 'users',
                    users: users
                });
            })
            .catch(error => {
                alert(error);
            });

        // Else, render home page with all projects
        } else {
            fetch(`/projects/0/${pageNumber}`)
            .then(response => response.json())
            .then(data => {

                // Handles server errors
                if (data.error) {
                    throw new Error(data.error);
                }

                this.setState({
                    page: 'home',
                    projects: data.projects,
                    totalPages: data.total_pages,
                    currentPage: data.current_page,
                    hasPrev: data.has_prev,
                    hasNext: data.has_next
                });
            })
            .catch(error => {
                alert(error);
            });
        }
    }

    // Function to update the state based on single user info
    loadProfile(userId) {
        fetch(`/profile/${userId}`)
        .then(response => response.json())
        .then(data => {

            // Handles errors from server
            if (data.error) {
                throw new Error(data.error);
            }

            this.setState({
                page: 'profile',
                user: data.user,
                projectsLeading: data.projects_leading,
                projectsLogging: data.projects_logging
            });
        })
        .catch(error => {
            alert(error);
        });
    }

    // Function to update the state based on single project info
    loadProject(projectId, pageNumber=1) {
        fetch(`/projects/${projectId}/${pageNumber}`)
        .then(response => response.json())
        .then(data => {

            if (data.error) {
                throw new Error(data.error);
            }

            this.setState({
                page: 'project',
                projects: data.project,
                boreholes: data.boreholes,
                totalPages: data.total_pages,
                currentPage: data.current_page,
                hasPrev: data.has_prev,
                hasNext: data.has_next
            });
        })
        .catch(error => {
            alert(error);
        });
    }

    // Function to update the state (borehole) based on server info
    loadBorehole(boreholeId) {
        fetch(`/borehole/${boreholeId}`)
        .then(response => response.json())
        .then(borehole => {

            // Handles server errors
            if (borehole.error) {
                throw new Error(borehole.error);
            }

            this.setState({
                page: 'borehole',
                boreholes: borehole
            });

            this.loadGeology(boreholeId, 0);
        })
        .catch(error => {
            alert(error);
        });
    }

    // Function to update the state (geology) based on updated server info
    loadGeology(boreholeId, strataId=0) {
        fetch(`/geology/${boreholeId}/${strataId}`)
        .then(response => response.json())
        .then(geology => {

            // Handles server errors
            if (geology.error) {
                throw new Error(geology.error);
            }

            this.setState({
                geology: geology
            })
        })
        .catch(error => {
            alert(error);
        });
    }

    // Function to handle views for different forms
    newForm(page) {

        // If form for creating new project requested
        if (page === 'project') {

            var newProjectBtn = document.querySelector('#new-project-btn');
            var newProjectForm = document.querySelector('#new-project-form');

            newProjectForm.style.display = 'block';
            newProjectBtn.style.display = 'none';

        // If form for creating new boreholes requested
        } else if (page === 'borehole') {

            var newBoreholeBtn = document.querySelector('#new-borehole-btn');
            var newBoreholeForm = document.querySelector('#new-borehole-form');

            newBoreholeForm.style.display = 'block';
            newBoreholeBtn.style.display = 'none';

        // If form for creating new geology layers requested
        } else if (page === 'layer') {

            var newLayerBtn = document.querySelector('#new-layer-btn');
            var newLayerForm = document.querySelector('#new-layer-form');
            var editLayerForm = document.querySelector('#edit-layer-form');

            editLayerForm.style.display = 'none';
            newLayerForm.style.display = 'block';
            newLayerBtn.style.display = 'none';

        // If form for editing project is requested
        } else if (page === 'editProject') {

            var editProjectBtn = document.querySelector('#edit-project-btn');
            var editProjectForm = document.querySelector('#new-project-form');
            var editProjectDetails = document.querySelector('#project-details');

            editProjectForm.style.display = 'block';
            editProjectBtn.style.display = 'none';
            editProjectDetails.style.display = 'none';

        // If form for editing borehole is requested
        } else if (page === 'editBorehole') {

            // Do not hide details so user can still see project details
            var editBoreholeBtn = document.querySelector('#edit-borehole-btn');
            var editBoreholeForm = document.querySelector('#new-borehole-form');

            editBoreholeForm.style.display = 'block';
            editBoreholeBtn.style.display = 'none';
        }
    }

    // Function to render and fills in previous info for editing geology
    editStrata(boreholeId, strataId) {

        // If no previous layers for editing
        if (this.state.geology.length === 0) {
            alert('No layers added yet.');
            return;
        }

        // Fetch strata info
        fetch(`/geology/${boreholeId}/${strataId}`)
        .then(response => response.json())
        .then(layer => {

            // Handles server errors
            if (layer.error) {
                throw new Error(layer.error);
            }

            this.setState({
                strata: layer
            });

            // Do not hide details so user can still see layer details
            var newLayerBtn = document.querySelector('#new-layer-btn');
            var editLayerForm = document.querySelector('#edit-layer-form');
            var newLayerForm = document.querySelector('#new-layer-form');

            newLayerForm.style.display = 'none';
            newLayerBtn.style.display = 'none';
            editLayerForm.style.display = 'block';
        })
        .catch(error => {
            alert(error);
        });
    }

    // Function to load all projects view
    renderAllProjects() {
        return (
            <div>

                {/* Image for page aesthetics */}
                <IntroImg />

                <h1>All Projects</h1>

                {/* Displays all projects */}
                <ProjectList projectList={this.state.projects}
                    loadProject={this.loadProject} />

                {/* Pagination for all projects listed */}
                <Pagination projectId='home'
                    total={this.state.totalPages}
                    current={this.state.currentPage}
                    hasPrev={this.state.hasPrev}
                    hasNext={this.state.hasNext}
                    loadPage={this.loadNavPage} />

                {/* Button to display hidden form for creating new project */}
                <button style={this.state.style}
                    id='new-project-btn'
                    className='btn btn-dark'
                    onClick={() => this.newForm('project')}>
                    New Project
                </button>

                {/* Hidden form to create new project */}
                <NewProjectForm loadNavPage={this.loadNavPage}
                    purposeFlag='new' />
            </div>
        )
    }

    // Function to load single project view
    renderProject() {
        return (
            <div>

                {/* Displays information about this project */}
                <ProjectDetails projects={this.state.projects}
                    loadProfile={this.loadProfile} />

                {/* Button to show form for editing project details */}
                <button id='edit-project-btn'
                    className='btn btn-dark'
                    onClick={() => this.newForm('editProject')}>
                    Edit Project
                </button>

                {/* Hidden form to update project details (pre-filled) */}
                <NewProjectForm id={this.state.projects.id}
                    title={this.state.projects.title}
                    reference={this.state.projects.ref}
                    client={this.state.projects.client}
                    description={this.state.projects.description}
                    purposeFlag='edit'
                    loadProject={this.loadProject} />

                {/* Show all boreholes under this project */}
                <ProjectView boreholes={this.state.boreholes}
                    loadBorehole={this.loadBorehole} />

                {/* Pagination component */}
                <Pagination projectId={this.state.projects.id}
                    total={this.state.totalPages}
                    current={this.state.currentPage}
                    hasPrev={this.state.hasPrev}
                    hasNext={this.state.hasNext}
                    loadPage={this.loadProject} />

                {/* Button to create new borehole */}
                <button id='new-borehole-btn'
                    className='btn btn-dark'
                    onClick={() => this.newForm('borehole')}>
                    New Borehole
                </button>

                {/* Hidden form to create new borehole */}
                <NewBoreholeForm project={this.state.projects}
                    loadProject={this.loadProject}
                    purposeFlag='new' />
                
                <hr />
                <Sketch id={this.state.projects.id}
                    loadProject={this.loadProject} />

                <hr />
                <MessageForm id={this.state.projects.id}
                    loadProject={this.loadProject}
                    loadProfile={this.loadProfile} />
            </div>
        )
    }

    // Function to load user profile (single user)
    renderProfile() {
        return (
            <div>

                {/* Shows profile of single user */}
                <ProfileView projectsLeading={this.state.projectsLeading}
                    projectsLogging={this.state.projectsLogging}
                    user={this.state.user}
                    loadProject={this.loadProject} />
            </div>
        )
    }

    // Function to load borehole and geology (single borehole)
    renderBorehole() {
        return (
            <div>

                {/* Load borehole and geology details */}
                <BoreholeView borehole={this.state.boreholes}
                    geology={this.state.geology}
                    loadProfile={this.loadProfile}
                    newForm={this.newForm}
                    loadBorehole={this.loadBorehole}
                    newForm={this.newForm}
                    editStrata={this.editStrata} />

                {/* Button to add new geology/layer to borehole */}
                <button id='new-layer-btn'
                    className='btn btn-dark'
                    onClick={() => this.newForm('layer')}>
                    Add Layer
                </button>

                {/* Hidden form for adding new geology/layer */}
                <NewLayerForm borehole={this.state.boreholes}
                    loadBorehole={this.loadBorehole}
                    purposeFlag='new' />

                {/* Hidden form for adding new geology/layer */}
                <NewLayerForm borehole={this.state.boreholes}
                    loadBorehole={this.loadBorehole}
                    id={this.state.strata.id}
                    start={this.state.strata.start_depth}
                    end={this.state.strata.end_depth}
                    sample={this.state.strata.sample_id}
                    spt={this.state.strata.spt}
                    field={this.state.strata.field_test}
                    description={this.state.strata.description}
                    purposeFlag='edit' />                
            </div>
        )
    }

    // Function to show all users view
    renderAllUsers() {
        return (
            <div>
                <h3>All Users</h3>

                {/* Displays all users currently on the system */}
                <AllProfileView users={this.state.users}
                    loadProfile={this.loadProfile} />
            </div>
        )
    }

    // Render method for the app to decide what view to show
    render() {

        // If request is for home page i.e. all projects
        if (this.state.page === 'home') {
            return this.renderAllProjects();

        // If request is for project page
        } else if (this.state.page === 'project') {
            return this.renderProject();

        // If request is for profile page
        } else if (this.state.page === 'profile') {
            return this.renderProfile();

        // If request is for borehole page
        } else if (this.state.page === 'borehole') {
            return this.renderBorehole();

        // If request is for all users page
        } else if (this.state.page === 'users') {
            return this.renderAllUsers();
        }
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
