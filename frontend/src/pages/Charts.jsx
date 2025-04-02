import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, MenuItem, Select, FormControl, InputLabel, Button,
  ToggleButton, ToggleButtonGroup, Paper, Fade, TextField
} from "@mui/material";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#a1887f"];

function Charts() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [chartType, setChartType] = useState("bar");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(`http://localhost:5000/api/users/appointments/${user.id}`);
      const docRes = await axios.get("http://localhost:5000/api/users/doctors");
      setAppointments(res.data);
      setDoctors(docRes.data);
    };
    fetchData();
  }, []);

  const getFilteredAppointments = () => {
    let filtered = [...appointments];

    if (selectedDoctor !== "all") {
      filtered = filtered.filter(a => a.doctorId._id === selectedDoctor);
    }

    if (startDate) {
      filtered = filtered.filter(a => dayjs(a.date).isAfter(dayjs(startDate).subtract(1, 'day')));
    }

    if (endDate) {
      filtered = filtered.filter(a => dayjs(a.date).isBefore(dayjs(endDate).add(1, 'day')));
    }

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  const chartData = (() => {
    if (selectedDoctor === "all") {
      const grouped = {};
      filteredAppointments.forEach(appt => {
        const date = dayjs(appt.date).format("YYYY-MM-DD");
        const doctorName = appt.doctorId.name;
        if (!grouped[date]) grouped[date] = { date };
        grouped[date][doctorName] = (grouped[date][doctorName] || 0) + 1;
      });
      return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
    } else {
      return filteredAppointments.reduce((acc, appt) => {
        const date = dayjs(appt.date).format("YYYY-MM-DD");
        const found = acc.find((i) => i.date === date);
        found ? found.count++ : acc.push({ date, count: 1 });
        return acc.sort((a, b) => a.date.localeCompare(b.date));
      }, []);
    }
  })();

  const pieData = (() => {
    if (selectedDoctor === "all") {
      const doctorTotals = {};
      filteredAppointments.forEach((appt) => {
        const docName = appt.doctorId.name;
        doctorTotals[docName] = (doctorTotals[docName] || 0) + 1;
      });
      return Object.entries(doctorTotals).map(([name, value]) => ({ name, value }));
    } else {
      return chartData.map(d => ({ name: d.date, value: d.count }));
    }
  })();

  const exportChartAsImage = async () => {
    const node = document.getElementById("chart-area");
    const canvas = await html2canvas(node);
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "chart.png";
    link.click();
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(chartData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "appointments.xlsx");
  };

  const total = pieData.reduce((sum, item) => sum + item.value, 0);
  const avg = pieData.length ? (total / pieData.length).toFixed(2) : 0;
  const mostActive = pieData.reduce((max, item) => item.value > max.value ? item : max, { value: 0 });

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3, color: "#1976d2" }}>
        Appointment Analytics
      </Typography>

      <Paper sx={{ p: 2, mb: 3, backgroundColor: "#e3f2fd" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Doctor</InputLabel>
            <Select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} label="Doctor">
              <MenuItem value="all">All Doctors</MenuItem>
              {doctors.map((doc) => (
                <MenuItem key={doc._id} value={doc._id}>{doc.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <ToggleButtonGroup value={chartType} exclusive onChange={(e, value) => setChartType(value)} sx={{ ml: 2 }}>
            <ToggleButton value="bar">Bar</ToggleButton>
            <ToggleButton value="line">Line</ToggleButton>
            <ToggleButton value="pie">Pie</ToggleButton>
          </ToggleButtonGroup>

          <Button variant="contained" onClick={exportChartAsImage}>Export PNG</Button>
          <Button variant="outlined" onClick={downloadExcel}>Export Excel</Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: "#fff" }}>
        <Typography variant="h6">Summary</Typography>
        <Typography>Total Appointments: {total}</Typography>
        <Typography>Average Per Day: {avg}</Typography>
        <Typography>Most Active: {mostActive.name} ({mostActive.value})</Typography>
      </Paper>

      <Fade in timeout={600}>
        <Box id="chart-area" sx={{ backgroundColor: "#fff", p: 2, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>
            Chart View ({chartType.toUpperCase()})
          </Typography>
          <ResponsiveContainer width="100%" height={350}>
            {chartType === "bar" && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedDoctor === "all"
                  ? doctors.map((doc, idx) => (
                      <Bar key={doc.name} dataKey={doc.name} fill={COLORS[idx % COLORS.length]} />
                    ))
                  : <Bar dataKey="count" fill="#1976d2" />
                }
              </BarChart>
            )}

            {chartType === "line" && (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedDoctor === "all"
                  ? doctors.map((doc, idx) => (
                      <Line key={doc.name} type="monotone" dataKey={doc.name} stroke={COLORS[idx % COLORS.length]} />
                    ))
                  : <Line type="monotone" dataKey="count" stroke="#1976d2" />
                }
              </LineChart>
            )}

            {chartType === "pie" && (
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </Box>
      </Fade>
    </Box>
  );
}

export default Charts;
