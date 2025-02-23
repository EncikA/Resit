document.addEventListener("DOMContentLoaded", () => {
    const { jsPDF } = window.jspdf;

    const addPaymentButton = document.getElementById("addPayment");
    const paymentList = document.getElementById("paymentList");
    const totalAmountField = document.getElementById("totalAmount");

    // Add Payment Item
    addPaymentButton.addEventListener("click", () => {
        const paymentItem = document.createElement("div");
        paymentItem.classList.add("paymentItem");
        paymentItem.innerHTML = `
            <input type="text" class="itemName" placeholder="Nama Item" required>
            <input type="number" class="itemAmount" placeholder="Jumlah (RM)" required>
            <button type="button" class="removeItem">X</button>
        `;
        paymentList.appendChild(paymentItem);
        updateTotal();
    });

    // Remove Payment Item
    paymentList.addEventListener("click", (event) => {
        if (event.target.classList.contains("removeItem")) {
            event.target.parentElement.remove();
            updateTotal();
        }
    });

    // Update Total Amount on Input Change
    paymentList.addEventListener("input", updateTotal);

    function updateTotal() {
        let total = 0;
        document.querySelectorAll(".itemAmount").forEach((input) => {
            total += parseFloat(input.value) || 0;
        });
        totalAmountField.value = total.toFixed(2);
    }

    function generatePDF(type) {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text(`Rekod Pembayaran - ${type}`, 105, 15, null, null, "center");

        // Retrieve Input Values
        const payerName = document.getElementById("payerName").value || "Nama Pembayar";
        const receivedBy = document.getElementById("receivedBy")?.value || "Nama Penerima"; // Ensure it's separate
        let transactionDate = document.getElementById("transactionDate").value;

        // Convert date format to dd/mm/yyyy
        if (transactionDate) {
            const dateParts = transactionDate.split("-");
            if (dateParts.length === 3) {
                transactionDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            }
        } else {
            transactionDate = "Tarikh Tidak Ditetapkan";
        }

        let y = 30;
        doc.text(`Bayaran Diterima Dari: ${payerName}`, 20, y);
        y += 8;
        doc.text(`Bayaran Diterima Oleh: ${receivedBy}`, 20, y); // Ensure different variable
        y += 8;
        doc.text(`Tarikh Transaksi: ${transactionDate}`, 20, y);
        y += 10;
        doc.text("Senarai Pembayaran:", 20, y);
        y += 6;

        // Add Payment Items
        document.querySelectorAll(".paymentItem").forEach((item, index) => {
            const itemName = item.querySelector(".itemName").value || "Item Tidak Dinyatakan";
            const itemAmount = item.querySelector(".itemAmount").value || "0.00";
            doc.text(`${index + 1}. ${itemName} - RM${itemAmount}`, 20, y);
            y += 6;
        });

        y += 10;
        doc.text(`Jumlah Pembayaran: RM${totalAmountField.value}`, 20, y);
        y += 12; // Ensure spacing before the footer

        // Footer
        doc.setFontSize(10);
        doc.text("© Sekolah Kebangsaan Stalon", 105, 280, null, null, "center");

        doc.save(`Rekod_${type}.pdf`);
    }

    // Generate Report & Receipt Buttons
    document.getElementById("generateReport").addEventListener("click", () => {
        generatePDF("Laporan");
    });

    document.getElementById("generateReceipt").addEventListener("click", () => {
        generatePDF("Resit");
    });
});
