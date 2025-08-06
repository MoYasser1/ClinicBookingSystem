  const apiBase = "https://localhost:7052/api"; // عدّل البورت حسب تشغيلك

  // 🟢 تحميل قائمة الأطباء
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
            <button class="btn btn-primary" onclick="openBooking(${doctor.id}, '${doctor.name}')">
              احجز مع الدكتور
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  fetchDoctors();

  // 🟢 التعامل مع المودال
  let currentDoctorId = null;
  let modal = new bootstrap.Modal(document.getElementById("bookingModal"));

  function openBooking(doctorId, doctorName) {
    currentDoctorId = doctorId;
    document.getElementById("doctorId").value = doctorId;
    document.getElementById("bookingModalLabel").innerText = `احجز مع ${doctorName}`;
    modal.show();
  }

  // 🟢 التعامل مع فورم الحجز
  document.getElementById("bookingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("❌ يجب تسجيل الدخول أولاً قبل الحجز.");
    window.location.href = "login.html";
    return;
  }

  const appointment = {
    doctorId: currentDoctorId,
    patientName: document.getElementById("patientName").value.trim(),
    appointmentDate: document.getElementById("appointmentDate").value,
    notes: document.getElementById("notes").value.trim()
  };

  try {
    const res = await fetch(`${apiBase}/appointment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(appointment)
    });

    console.log("📥 Response status:", res.status);
    const resText = await res.text();
    console.log("📥 Response body:", resText);

    if (res.ok) {
      alert("✅ تم الحجز بنجاح!");
      modal.hide();
    } else if (res.status === 409) {
      alert("❌ هذا الموعد محجوز بالفعل!");
    } else if (res.status === 401) {
      alert("❌ غير مصرح لك بالحجز. سجّل الدخول.");
      window.location.href = "login.html";
    } else {
      alert("❌ حدث خطأ أثناء الحجز.");
    }

  } catch (err) {
    console.error("❌ Network error:", err);
    alert("⚠️ حصل خطأ في الاتصال بالسيرفر.");
  }
});
