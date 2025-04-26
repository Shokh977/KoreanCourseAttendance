# Korean Class Attendance Dashboard

An interactive dashboard for the Korean Class Attendance Bot that visualizes attendance data.

## Features

- **Statistical Overview**: At-a-glance summary of total students, class sessions, and attendances
- **Attendance Trends**: Chart displaying attendance patterns over time
- **Top Attendees**: Visual representation of the most active students
- **Filtering**: Filter attendance data by date range
- **Detailed Participant Statistics**: Track each student's attendance with percentage and last attended date
- **Attendance by Date**: Browse all attendance records organized by class date
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Running the Dashboard

There are two ways to run the dashboard:

#### 1. As part of the bot (default)

The dashboard is started automatically when you run the bot:

```
npm start
```

#### 2. Standalone mode

You can run just the dashboard separately:

```
node start-dashboard.js
```

### Accessing the Dashboard

Once running, access the dashboard at:

- Local development: `http://localhost:4000`
- Production: Your deployed URL

### Default Login Credentials

- Username: `admin`
- Password: `koreanclass2025`

You can change these by setting `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your `.env` file.

## Configuration

Configure the dashboard through environment variables in your `.env` file:

```
# Dashboard settings
DASHBOARD_PORT=4000
ADMIN_USERNAME=yourusername
ADMIN_PASSWORD=yourpassword
SESSION_SECRET=your-secure-secret-key
```

## Data Filtering

Use the date filter at the top of the dashboard to view attendance for specific time periods.

## Troubleshooting

If the dashboard displays an error:

1. Check that your backend server is running
2. Verify the API endpoint in the dashboard.js file
3. Ensure your MongoDB database is accessible
4. Check network connectivity between the dashboard and backend

## Customization

The dashboard uses Bootstrap 5 for styling and Chart.js for data visualization. You can customize the appearance by editing:

- `views/dashboard.ejs` for layout and structure
- `public/css/style.css` for custom styling
