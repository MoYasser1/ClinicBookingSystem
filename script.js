const apiBase = "https://localhost:7052/api"; // عدّل البورت حسب تشغيلك

async function fetchDoctors() {
  const res = await fetch(`${apiBase}/doctor`);
  const doctors = await res.json();

  const container = document.getElementById("doctorsList");
  container.innerHTML = "";

  doctors.forEach(doctor => {
    const card = document.createElement("div");
    card.className = "col";

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${doctor.name}</h5>
          <p class="card-text">
            التخصص: ${doctor.specialization}<br/>
            البريد: ${doctor.email}<br/>
            الهاتف: ${doctor.phoneNumber}
          </p>
          <button class="btn btn-primary" onclick="openBooking(${doctor.id}, '${doctor.name}')">احجز مع الدكتور</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

fetchDoctors();

// نافذة الحجز
let currentDoctorId = null;
let modal = new bootstrap.Modal(document.getElementById("bookingModal"));

function openBooking(doctorId, doctorName) {
  currentDoctorId = doctorId;
  document.getElementById("doctorId").value = doctorId;
  document.getElementById("bookingModalLabel").innerText = `احجز مع ${doctorName}`;
  modal.show();
}

document.getElementById("bookingForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const appointment = {
    doctorId: currentDoctorId,
    patientName: document.getElementById("patientName").value,
    appointmentDate: document.getElementById("appointmentDate").value,
    notes: document.getElementById("notes").value
  };
  const res = await fetch(`${apiBase}/appointment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointment)
  });

  if (res.status === 200) {
    alert("✅ تم الحجز بنجاح!");
    modal.hide();
  } else if (res.status === 409) {
    alert("❌ هذا الموعد محجوز بالفعل!");
  } else {
    alert("❌ حدث خطأ أثناء الحجز.");
  }
});


