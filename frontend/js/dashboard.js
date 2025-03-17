document.addEventListener("DOMContentLoaded", () => {
  const backupList = document.getElementById("backup-list");
  const logins1h = document.getElementById("logins-1h");
  const logins12h = document.getElementById("logins-12h");
  const logins24h = document.getElementById("logins-24h");
  const logins1w = document.getElementById("logins-1w");
  
  const token = localStorage.getItem('token');

  if (!token) {
      alert("Usuário não autenticado!");
      window.location.href = "index.html";
      return;
  }

  function fetchWithAuth(url) {
      return fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json());
  }

  // Fetch backups
  fetchWithAuth('http://localhost:3000/backups')
      .then(data => {
          backupList.innerHTML = data.backups.map(file => `<li>${file}</li>`).join('');
      })
      .catch(() => {
          backupList.innerHTML = "<li>Erro ao carregar backups.</li>";
      });

  // Fetch logs
  fetchWithAuth('http://localhost:3000/logs')
      .then(data => {
          logins1h.textContent = data.logs.length;
          logins12h.textContent = data.logs.length * 2; // Placeholder logic
          logins24h.textContent = data.logs.length * 3;
          logins1w.textContent = data.logs.length * 5;
      })
      .catch(() => {
          logins1h.textContent = "Erro";
          logins12h.textContent = "Erro";
          logins24h.textContent = "Erro";
          logins1w.textContent = "Erro";
      });

  // Backup trigger button (if needed)
  const backupButton = document.getElementById("trigger-backup");
  if (backupButton) {
      backupButton.addEventListener("click", () => {
          fetch('http://localhost:3000/backup', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` }
          }).then(() => alert("Backup iniciado!"))
          .catch(() => alert("Erro ao iniciar backup."));
      });
  }
});
