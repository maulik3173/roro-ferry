import PDFDocument from 'pdfkit';
import fs from 'fs';

/**
 * Generate an e-ticket PDF file for a ferry booking.
 * @param {Object} booking - Booking details object.
 * @param {string} outputPath - File path to save the generated PDF.
 * @returns {Promise<string>} - Resolves with the output file path when done.
 */
const generateTicketPDF = async (booking, outputPath) => {
  const ferry = booking.ferryId || {};
  const schedule = booking.scheduleId || {};

  // Format 24-hour time (HH:mm) to 12-hour AM/PM format
  function formatTimeToAMPM(time24) {
    if (!time24) return 'N/A';

    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;

    return `${hour}:${minute} ${ampm}`;
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Colors
    const primaryColor = '#003366';
    const black = '#000000';
    const arrowColor = primaryColor;

    // Draw Border
    doc
      .rect(40, 40, 520, 500)
      .strokeColor(primaryColor)
      .lineWidth(2)
      .stroke();

    // Header
    const headerY = 50;
    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .fillColor(primaryColor)
      .text('RO-RO FERRY E-TICKET', 0, headerY, { align: 'center' });

    const lineY = headerY + 30;
    doc
      .moveTo(45, lineY)
      .lineTo(555, lineY)
      .strokeColor(primaryColor)
      .lineWidth(1)
      .stroke();

    // Layout coords
    const margin = 50;
    const usableWidth = 520;
    const sectionGap = 30;
    const lineSpacing = 20;

    const leftX = margin;
    const rightX = margin + usableWidth * 0.5;
    const topY = lineY + 20;

    // ===== Top Row =====
    // Ferry Details (Left)
    doc
      .fontSize(14)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('Ferry Details', leftX, topY);

    doc
      .fontSize(12)
      .fillColor(black)
      .font('Helvetica')
      .text(`Ferry Name: ${ferry.name || 'N/A'}`, leftX, topY + lineSpacing)
      .text(`Ferry No: ${ferry.ferryCode || 'N/A'}`, leftX, topY + 2 * lineSpacing);

    // Booking Details (Right)
    doc
      .fontSize(16)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('Booking Details', rightX, topY);

    const detailsStartY = topY + lineSpacing;

    // Destination and arrow
    const fromCity = schedule.from || 'N/A';
    const toCity = schedule.to || 'N/A';
    const fromText = `Destination: ${fromCity}`;
    const toText = toCity;

    doc.font('Helvetica').fontSize(12).fillColor(black);
    const fromWidth = doc.widthOfString(fromText);
    const textY = detailsStartY;

    doc.text(fromText, rightX, textY, { lineBreak: false });

    const arrowStartX = rightX + fromWidth + 3;
    const arrowWidth = 13;
    const arrowHeight = 4;
    const arrowHeadSize = 5;
    const arrowY = textY + (12 * 1.2) / 3;

    // Arrow shaft
    doc
      .rect(arrowStartX, arrowY - arrowHeight / 2, arrowWidth, arrowHeight)
      .fillColor(arrowColor)
      .fill();

    // Arrow head
    doc
      .fillColor(arrowColor)
      .moveTo(arrowStartX + arrowWidth, arrowY - arrowHeight / 2 - arrowHeadSize / 2)
      .lineTo(arrowStartX + arrowWidth + arrowHeadSize, arrowY)
      .lineTo(arrowStartX + arrowWidth, arrowY + arrowHeight / 2 + arrowHeadSize / 2)
      .fill();

    // Destination To city text
    const toStartX = arrowStartX + arrowWidth + arrowHeadSize + 3;
    doc.fillColor(black).text(toText, toStartX, textY, { lineBreak: false });

    // Trip Type & Dates
    const tripType = schedule.tripType || 'one-way';
    doc.text(`Trip Type: ${tripType}`, rightX, detailsStartY + lineSpacing);

    if (tripType === 'one-way') {
      const depDate = schedule.departureDate
        ? new Date(schedule.departureDate).toLocaleDateString()
        : 'N/A';

      const boardingTimeRaw = schedule.arrivalTime || 'N/A';
      const boardingTime = boardingTimeRaw === 'N/A' ? 'N/A' : formatTimeToAMPM(boardingTimeRaw);

      doc.text(`Departure Date: ${depDate}`, rightX, detailsStartY + lineSpacing * 2);
      doc.text(`Boarding Time: ${boardingTime}`, rightX, detailsStartY + lineSpacing * 3);
    } else if (tripType === 'round-trip') {
      const returnDate = schedule.returnDate
        ? new Date(schedule.returnDate).toLocaleDateString()
        : 'N/A';

      const returnTimeRaw = schedule.returnTime || 'N/A';
      const returnTime = returnTimeRaw === 'N/A' ? 'N/A' : formatTimeToAMPM(returnTimeRaw);

      doc.text(`Return Date: ${returnDate}`, rightX, detailsStartY + lineSpacing * 2);
      doc.text(`Return Time: ${returnTime}`, rightX, detailsStartY + lineSpacing * 3);
    }

    // ===== Middle Row =====
    const midRowY = topY + 6 * lineSpacing + sectionGap;

    // Travel Details (Left)
    doc
      .fontSize(14)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('Travel Details', leftX, midRowY);

    doc
      .fontSize(12)
      .fillColor(black)
      .font('Helvetica')
      .text(`Category: ${booking.category || 'N/A'}`, leftX, midRowY + lineSpacing)
      .text(`Class: ${booking.className || 'N/A'}`, leftX, midRowY + 2 * lineSpacing)
      .text(`Seat: ${booking.seatNumber || 'N/A'}`, leftX, midRowY + 3 * lineSpacing);

    // Passenger Details (Right)
    doc
      .fontSize(14)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('Passenger Details', rightX, midRowY);

    const passenger = booking.passengers?.[0];
    doc
      .fontSize(12)
      .fillColor(black)
      .font('Helvetica')
      .text(
        `Name: ${passenger ? `${passenger.firstName} ${passenger.lastName}` : 'N/A'}`,
        rightX,
        midRowY + lineSpacing
      )
      .text(`Gender: ${passenger?.gender || 'N/A'}`, rightX, midRowY + 2 * lineSpacing)
      .text(`Age: ${passenger?.age || 'N/A'}`, rightX, midRowY + 3 * lineSpacing)
      .text(`Proof: ${booking.proofType || 'N/A'} - ${booking.proofNumber || 'N/A'}`, rightX, midRowY + 4 * lineSpacing)
      .text(`Contact: ${booking.contactNumber || 'N/A'}`, rightX, midRowY + 5 * lineSpacing);

    // ===== Bottom Row =====
    const bottomRowY = midRowY + 7 * lineSpacing + sectionGap;

    // Vehicle Details (Left)
    doc
      .fontSize(14)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('Vehicle Details', leftX, bottomRowY);

    doc.fontSize(12).fillColor(black).font('Helvetica');
    const vehicle = booking.vehicles?.[0];
    doc.text(`Total Vehicles: ${booking.vehicles?.length || 0}`, leftX, bottomRowY + lineSpacing);
    doc.text(`Vehicle Type: ${vehicle?.vehicleType || 'N/A'}`, leftX, bottomRowY + 2 * lineSpacing);
    doc.text(`Vehicle Name: ${vehicle?.vehicleName || 'N/A'}`, leftX, bottomRowY + 3 * lineSpacing);
    doc.text(`Vehicle Number: ${vehicle?.vehicleNumber || 'N/A'}`, leftX, bottomRowY + 4 * lineSpacing);

    // Payment Details (Right)
    doc
      .fontSize(14)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('Payment Details', rightX, bottomRowY);

    doc
      .fontSize(12)
      .fillColor(black)
      .font('Helvetica')
      .text(`Payment ID: ${booking._id || 'N/A'}`, rightX, bottomRowY + lineSpacing)
      .text(`Amount Paid: ${booking.totalAmount || '0'}`, rightX, bottomRowY + lineSpacing*2);
     

    // Footer
    const footerY = 580;
    doc
      .fontSize(12)
      .fillColor(primaryColor)
      .font('Helvetica-Bold')
      .text('Thank you for choosing our ferry service!', 0, footerY, { align: 'center' });

    doc.end();

    stream.on('finish', () => {
      resolve(outputPath);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
};

export default generateTicketPDF;
