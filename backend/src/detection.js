const RULES = Object.freeze({
  ATTENDANCE_DROP: 'ATTENDANCE_DROP',
  MISSED_ASSIGNMENTS: 'MISSED_ASSIGNMENTS',
  FUNDING_STATUS_CHANGE: 'FUNDING_STATUS_CHANGE',
  ENGAGEMENT_DROPOFF: 'ENGAGEMENT_DROPOFF',
  COMBINED_SIGNAL: 'COMBINED_SIGNAL'
});

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + Number(value), 0) / values.length : 0;
}

function attendanceDrop(student) {
  const rows = [...student.attendance].sort((a,b) => new Date(a.periodStart)-new Date(b.periodStart));
  if (rows.length < 2) return null;
  const current = Number(rows.at(-1).attendancePercent);
  const baseline = average(rows.slice(-5, -1).map(r => r.attendancePercent));
  if (!baseline) return null;
  const drop = ((baseline - current) / baseline) * 100;
  if (drop > 25) return {
    ruleCode: RULES.ATTENDANCE_DROP,
    priority: 'medium',
    thresholdValue: 25,
    observedValue: Number(drop.toFixed(2)),
    detectedAt: new Date(rows.at(-1).periodStart).toISOString(),
    reason: `Attendance dropped ${drop.toFixed(1)}% from a ${baseline.toFixed(1)}% rolling baseline to ${current.toFixed(1)}%.`
  };
  return null;
}

function missedAssignments(student) {
  const rows = [...student.assignments].sort((a,b) => new Date(b.dueDate)-new Date(a.dueDate));
  let consecutive = 0;
  for (const row of rows) {
    if (!row.submitted) consecutive += 1;
    else break;
  }
  if (consecutive >= 2) return {
    ruleCode: RULES.MISSED_ASSIGNMENTS,
    priority: 'medium',
    thresholdValue: 2,
    observedValue: consecutive,
    detectedAt: new Date(rows[0].dueDate).toISOString(),
    reason: `${consecutive} consecutive assignment submissions were missed (threshold: 2).`
  };
  return null;
}

function fundingStatusChange(student) {
  const rows = [...student.fundingHistory].sort((a,b) => new Date(a.effectiveAt)-new Date(b.effectiveAt));
  if (rows.length < 2) return null;
  const previous = rows.at(-2).status;
  const current = rows.at(-1).status;
  if (previous !== current) return {
    ruleCode: RULES.FUNDING_STATUS_CHANGE,
    priority: 'medium',
    thresholdValue: 1,
    observedValue: 1,
    detectedAt: new Date(rows.at(-1).effectiveAt).toISOString(),
    reason: `Funding status changed from ${previous} to ${current}.`
  };
  return null;
}

function engagementDropoff(student) {
  const rows = [...student.engagement].sort((a,b) => new Date(a.periodStart)-new Date(b.periodStart));
  if (rows.length < 2) return null;
  const current = rows.at(-1).loginCount;
  const baseline = average(rows.slice(-5, -1).map(r => r.loginCount));
  if (!baseline) return null;
  const drop = ((baseline - current) / baseline) * 100;
  if (drop > 50) return {
    ruleCode: RULES.ENGAGEMENT_DROPOFF,
    priority: 'medium',
    thresholdValue: 50,
    observedValue: Number(drop.toFixed(2)),
    detectedAt: new Date(rows.at(-1).periodStart).toISOString(),
    reason: `Login frequency dropped ${drop.toFixed(1)}% from a ${baseline.toFixed(1)} login recent average to ${current}.`
  };
  return null;
}

function combinedSignal(flags, now = new Date()) {
  const windowStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const recent = flags.filter(f => {
    const detectedAt = new Date(f.detectedAt || now);
    return detectedAt >= windowStart && detectedAt <= now && f.ruleCode !== RULES.COMBINED_SIGNAL;
  });
  if (recent.length >= 2) return {
    ruleCode: RULES.COMBINED_SIGNAL,
    priority: 'high',
    thresholdValue: 2,
    observedValue: recent.length,
    detectedAt: recent.reduce((latest, flag) => {
      const detectedAt = new Date(flag.detectedAt || now);
      return detectedAt > latest ? detectedAt : latest;
    }, windowStart).toISOString(),
    reason: `${recent.length} independent risk signals fired within a 14-day window: ${recent.map(f => f.ruleCode).join(', ')}.`
  };
  return null;
}

function detectStudent(student, now = new Date()) {
  const flags = [attendanceDrop(student), missedAssignments(student), fundingStatusChange(student), engagementDropoff(student)].filter(Boolean)
    .map(flag => ({...flag, detectedAt: flag.detectedAt || now.toISOString(), studentId: student.id}));
  const combined = combinedSignal(flags, now);
  if (combined) flags.push({...combined, studentId: student.id});
  return flags;
}

module.exports = { RULES, attendanceDrop, missedAssignments, fundingStatusChange, engagementDropoff, combinedSignal, detectStudent };
