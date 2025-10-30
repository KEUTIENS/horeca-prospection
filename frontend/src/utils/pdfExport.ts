import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportTourToPDF = (tour: any, steps: any[], prospects: any[]) => {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Bleu
  doc.text('HORECA Prospection', 20, 20);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Tournée: ${tour.name || 'Sans nom'}`, 20, 35);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${new Date(tour.date).toLocaleDateString('fr-FR')}`, 20, 45);
  doc.text(`Statut: ${getStatusLabel(tour.status)}`, 20, 52);
  
  // Tableau des étapes
  const tableData = steps.map((step, index) => {
    const prospect = prospects.find(p => p.id === step.prospectId);
    return [
      index + 1,
      prospect?.name || 'N/A',
      `${prospect?.address || ''}, ${prospect?.city || ''}`,
      prospect?.phone || 'N/A',
      getStepStatusLabel(step.status)
    ];
  });
  
  autoTable(doc, {
    startY: 60,
    head: [['#', 'Établissement', 'Adresse', 'Téléphone', 'Statut']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 50 },
      2: { cellWidth: 60 },
      3: { cellWidth: 35 },
      4: { cellWidth: 25 }
    }
  });
  
  // Pied de page
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} sur ${pageCount} - HORECA Prospection - ${new Date().toLocaleDateString('fr-FR')}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Télécharger
  doc.save(`tournee-${tour.name || 'sans-nom'}-${new Date().toISOString().slice(0, 10)}.pdf`);
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    planned: 'Planifiée',
    in_progress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée'
  };
  return labels[status] || status;
};

const getStepStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    done: 'Terminé',
    skipped: 'Ignoré'
  };
  return labels[status] || status;
};

