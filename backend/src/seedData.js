const names = [
  ['Anele','Mthembu'],['Sibusiso','Dlamini'],['Lerato','Mokoena'],['Thando','Ndlovu'],['Ayanda','Khumalo'],
  ['Zanele','Cele'],['Sipho','Mthethwa'],['Nokuthula','Zulu'],['Lwazi','Naidoo'],['Precious','Molefe'],
  ['Musa','Ngcobo'],['Kea','Mahlangu'],['Bongani','Sithole'],['Nosipho','Mbatha'],['Lindokuhle','Mkhize'],
  ['Samkelo','Buthelezi'],['Karabo','Mabena'],['Amahle','Hadebe'],['Siyabonga','Gumede'],['Khanyisa','Moyo']
];

const programmes = ['Information Technology','Computer Science','Business Information Systems','Data Science'];
const isoDate = date => date.toISOString().slice(0, 10);

function createSeedProfiles(now = new Date()) {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 35);

  return names.map(([firstName, lastName], index) => {
    const attendanceDrop = index % 4 === 0 || index === 17;
    const engagementDrop = index % 5 === 0 || index === 18;
    const missedAssignments = index % 3 === 0 || index === 19;
    const fundingChange = index % 4 === 1 || index === 18;

    const attendance = Array.from({ length: 6 }, (_, week) => {
      const periodStart = new Date(start);
      periodStart.setUTCDate(periodStart.getUTCDate() + week * 7);
      return {
        periodStart: isoDate(periodStart),
        attendancePercent: attendanceDrop && week === 5 ? 55 : 88 + ((index + week) % 5)
      };
    });

    const engagement = Array.from({ length: 6 }, (_, week) => {
      const periodStart = new Date(start);
      periodStart.setUTCDate(periodStart.getUTCDate() + week * 7);
      return {
        periodStart: isoDate(periodStart),
        loginCount: engagementDrop && week === 5 ? 2 : 8 + ((index + week) % 3)
      };
    });

    const assignments = Array.from({ length: 4 }, (_, assignmentIndex) => {
      const dueDate = new Date(start);
      dueDate.setUTCDate(dueDate.getUTCDate() + assignmentIndex * 10);
      const submitted = !(missedAssignments && assignmentIndex >= 2);
      const submittedAt = submitted ? new Date(dueDate.getTime() + 86400000).toISOString() : null;
      return { assignmentCode: `A${assignmentIndex + 1}`, dueDate: isoDate(dueDate), submitted, submittedAt };
    });

    const firstFundingDate = new Date(start);
    firstFundingDate.setUTCDate(firstFundingDate.getUTCDate() + 28);
    const fundingHistory = [{ status: 'active', effectiveAt: firstFundingDate.toISOString() }];
    if (fundingChange) {
      const changedDate = new Date(start);
      changedDate.setUTCDate(changedDate.getUTCDate() + 35);
      fundingHistory.push({
        status: ['approved', 'pending', 'unresolved'][index % 3],
        effectiveAt: changedDate.toISOString()
      });
    }

    return {
      studentNumber: `SR${String(1001 + index)}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@studentreach.test`,
      programme: programmes[index % programmes.length],
      yearLevel: (index % 3) + 1,
      attendance,
      assignments,
      fundingHistory,
      engagement
    };
  });
}

module.exports = { createSeedProfiles };
