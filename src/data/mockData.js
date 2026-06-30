export const mockStations = [
  { id: 'STA-001', name: 'Nairobi Central', region: 'Nairobi', manager: 'James Mwangi', address: 'Kenyatta Ave, Nairobi', lat: -1.286389, lng: 36.817223, status: 'operational', fuelTypes: ['PMS', 'AGO', 'DPK'], tanks: 4, pumps: 8, dailySales: 45000, monthlySales: 1350000, lastAudit: '2025-04-15', riskScore: 12, established: '2018-03-01', phone: '+254 20 123 4567' },
  { id: 'STA-002', name: 'Mombasa Port', region: 'Coast', manager: 'Amina Hassan', address: 'Moi Ave, Mombasa', lat: -4.043477, lng: 39.668206, status: 'operational', fuelTypes: ['PMS', 'AGO'], tanks: 3, pumps: 6, dailySales: 38000, monthlySales: 1140000, lastAudit: '2025-03-20', riskScore: 8, established: '2016-07-12', phone: '+254 41 234 5678' },
  { id: 'STA-003', name: 'Kisumu Lakeside', region: 'Nyanza', manager: 'Peter Ochieng', address: 'Oginga Odinga St, Kisumu', lat: -0.091702, lng: 34.767956, status: 'maintenance', fuelTypes: ['PMS', 'AGO', 'LPG'], tanks: 3, pumps: 4, dailySales: 22000, monthlySales: 660000, lastAudit: '2025-02-10', riskScore: 35, established: '2019-11-05', phone: '+254 57 345 6789' },
  { id: 'STA-004', name: 'Nakuru Highway', region: 'Rift Valley', manager: 'Grace Wanjiku', address: 'A104, Nakuru', lat: -0.303099, lng: 36.080026, status: 'operational', fuelTypes: ['PMS', 'AGO'], tanks: 4, pumps: 10, dailySales: 55000, monthlySales: 1650000, lastAudit: '2025-04-28', riskScore: 5, established: '2017-02-20', phone: '+254 51 456 7890' },
  { id: 'STA-005', name: 'Eldoret North', region: 'Rift Valley', manager: 'David Kipchoge', address: 'Uganda Rd, Eldoret', lat: 0.520360, lng: 35.269779, status: 'operational', fuelTypes: ['PMS', 'AGO', 'DPK'], tanks: 3, pumps: 6, dailySales: 31000, monthlySales: 930000, lastAudit: '2025-01-15', riskScore: 22, established: '2020-06-14', phone: '+254 53 567 8901' },
  { id: 'STA-006', name: 'Thika Road Mall', region: 'Nairobi', manager: 'Susan Kamau', address: 'Thika Superhighway, Nairobi', lat: -1.219630, lng: 36.902519, status: 'operational', fuelTypes: ['PMS', 'AGO', 'LPG'], tanks: 5, pumps: 12, dailySales: 72000, monthlySales: 2160000, lastAudit: '2025-04-30', riskScore: 7, established: '2015-09-10', phone: '+254 20 678 9012' },
  { id: 'STA-007', name: 'Garissa Junction', region: 'North Eastern', manager: 'Ali Mohamed', address: 'B8 Road, Garissa', lat: -0.453220, lng: 39.646060, status: 'suspended', fuelTypes: ['PMS', 'AGO'], tanks: 2, pumps: 4, dailySales: 0, monthlySales: 0, lastAudit: '2025-02-28', riskScore: 85, established: '2021-01-08', phone: '+254 46 789 0123' },
  { id: 'STA-008', name: 'Nyeri Town', region: 'Central', manager: 'John Githui', address: 'Kimathi Way, Nyeri', lat: -0.416880, lng: 36.951910, status: 'operational', fuelTypes: ['PMS', 'AGO'], tanks: 3, pumps: 6, dailySales: 28000, monthlySales: 840000, lastAudit: '2025-03-05', riskScore: 15, established: '2018-12-22', phone: '+254 61 890 1234' },
]

export const mockFleet = [
  { id: 'VEH-001', plate: 'KBZ 001A', type: 'Tanker', capacity: 33000, fuel: 'AGO', driver: 'Moses Kariuki', station: 'STA-001', status: 'in-transit', mileage: 128540, lastService: '2025-04-01', nextService: '2025-07-01', gpsLat: -1.3, gpsLng: 36.9, speed: 65, insurance: '2025-12-31', fuelLevel: 72 },
  { id: 'VEH-002', plate: 'KBZ 002B', type: 'Tanker', capacity: 28000, fuel: 'PMS', driver: 'Paul Njoroge', station: 'STA-002', status: 'loading', mileage: 95300, lastService: '2025-03-15', nextService: '2025-06-15', gpsLat: -4.0, gpsLng: 39.7, speed: 0, insurance: '2025-10-15', fuelLevel: 100 },
  { id: 'VEH-003', plate: 'KBZ 003C', type: 'Tanker', capacity: 33000, fuel: 'AGO', driver: 'Francis Omondi', station: 'STA-004', status: 'delivered', mileage: 210050, lastService: '2025-02-20', nextService: '2025-05-20', gpsLat: -0.3, gpsLng: 36.1, speed: 0, insurance: '2026-01-20', fuelLevel: 8 },
  { id: 'VEH-004', plate: 'KBZ 004D', type: 'Service Van', capacity: 0, fuel: 'PMS', driver: 'Ruth Achieng', station: 'STA-003', status: 'maintenance', mileage: 67800, lastService: '2024-12-10', nextService: '2025-03-10', gpsLat: -0.09, gpsLng: 34.77, speed: 0, insurance: '2025-08-30', fuelLevel: 45 },
  { id: 'VEH-005', plate: 'KBZ 005E', type: 'Tanker', capacity: 45000, fuel: 'PMS', driver: 'Tom Mutua', station: 'STA-006', status: 'in-transit', mileage: 182400, lastService: '2025-04-10', nextService: '2025-07-10', gpsLat: -1.1, gpsLng: 36.8, speed: 88, insurance: '2025-11-05', fuelLevel: 55 },
  { id: 'VEH-006', plate: 'KBZ 006F', type: 'Tanker', capacity: 28000, fuel: 'DPK', driver: 'Anna Muthoni', station: 'STA-005', status: 'idle', mileage: 44200, lastService: '2025-04-25', nextService: '2025-07-25', gpsLat: 0.52, gpsLng: 35.27, speed: 0, insurance: '2026-02-28', fuelLevel: 0 },
  { id: 'VEH-007', plate: 'KBZ 007G', type: 'Pickup', capacity: 0, fuel: 'PMS', driver: 'Ben Otieno', station: 'STA-001', status: 'in-transit', mileage: 38900, lastService: '2025-05-01', nextService: '2025-08-01', gpsLat: -1.25, gpsLng: 36.82, speed: 55, insurance: '2026-03-15', fuelLevel: 60 },
]

export const mockTankReadings = [
  { id: 'TNK-001', stationId: 'STA-001', stationName: 'Nairobi Central', tankNo: 'T1', product: 'PMS', capacity: 30000, currentLevel: 18450, openingStock: 22000, closingStock: 18450, received: 0, salesVolume: 3550, variance: -12, variancePct: 0.34, date: '2025-05-12', status: 'normal' },
  { id: 'TNK-002', stationId: 'STA-001', stationName: 'Nairobi Central', tankNo: 'T2', product: 'AGO', capacity: 30000, currentLevel: 5200, openingStock: 8500, closingStock: 5200, received: 0, salesVolume: 3240, variance: -60, variancePct: 1.85, date: '2025-05-12', status: 'critical' },
  { id: 'TNK-003', stationId: 'STA-001', stationName: 'Nairobi Central', tankNo: 'T3', product: 'DPK', capacity: 20000, currentLevel: 12800, openingStock: 14200, closingStock: 12800, received: 0, salesVolume: 1380, variance: 20, variancePct: 1.45, date: '2025-05-12', status: 'warning' },
  { id: 'TNK-004', stationId: 'STA-002', stationName: 'Mombasa Port', tankNo: 'T1', product: 'PMS', capacity: 25000, currentLevel: 9800, openingStock: 15000, closingStock: 9800, received: 0, salesVolume: 5100, variance: 100, variancePct: 1.96, date: '2025-05-12', status: 'warning' },
  { id: 'TNK-005', stationId: 'STA-002', stationName: 'Mombasa Port', tankNo: 'T2', product: 'AGO', capacity: 25000, currentLevel: 21000, openingStock: 21000, closingStock: 21000, received: 25000, salesVolume: 25000, variance: 0, variancePct: 0, date: '2025-05-12', status: 'normal' },
  { id: 'TNK-006', stationId: 'STA-006', stationName: 'Thika Road Mall', tankNo: 'T1', product: 'PMS', capacity: 40000, currentLevel: 38000, openingStock: 38000, closingStock: 38000, received: 40000, salesVolume: 40000, variance: 0, variancePct: 0, date: '2025-05-12', status: 'normal' },
  { id: 'TNK-007', stationId: 'STA-007', stationName: 'Garissa Junction', tankNo: 'T1', product: 'PMS', capacity: 15000, currentLevel: 15000, openingStock: 15000, closingStock: 15000, received: 0, salesVolume: 0, variance: -450, variancePct: 3.0, date: '2025-05-12', status: 'anomaly' },
  { id: 'TNK-008', stationId: 'STA-004', stationName: 'Nakuru Highway', tankNo: 'T1', product: 'AGO', capacity: 35000, currentLevel: 28000, openingStock: 33000, closingStock: 28000, received: 0, salesVolume: 4980, variance: 20, variancePct: 0.4, date: '2025-05-12', status: 'normal' },
]

export const mockMaintenanceJobs = [
  { id: 'MNT-001', stationId: 'STA-003', station: 'Kisumu Lakeside', vehicleId: null, type: 'Pump Repair', description: 'Pump 2 not dispensing correctly. Flow meter calibration required.', priority: 'high', status: 'in-progress', contractorId: 'CON-002', assignedTech: 'Joseph Otieno', createdAt: '2025-05-01', scheduledDate: '2025-05-08', estimatedCompletion: '2025-05-15', actualCompletion: null, cost: 85000, invoiceNo: 'INV-20253421', notes: 'Parts ordered, awaiting delivery' },
  { id: 'MNT-002', stationId: 'STA-001', station: 'Nairobi Central', vehicleId: 'VEH-003', type: 'Engine Overhaul', description: 'Full engine overhaul. Tanker due for 200,000km service.', priority: 'medium', status: 'scheduled', contractorId: 'CON-001', assignedTech: 'Mike Waweru', createdAt: '2025-04-20', scheduledDate: '2025-05-20', estimatedCompletion: '2025-06-05', actualCompletion: null, cost: 350000, invoiceNo: null, notes: '' },
  { id: 'MNT-003', stationId: 'STA-005', station: 'Eldoret North', vehicleId: null, type: 'Tank Inspection', description: 'Annual tank integrity inspection and cathodic protection test.', priority: 'low', status: 'completed', contractorId: 'CON-003', assignedTech: 'Sarah Juma', createdAt: '2025-03-01', scheduledDate: '2025-04-01', estimatedCompletion: '2025-04-03', actualCompletion: '2025-04-02', cost: 45000, invoiceNo: 'INV-20252808', notes: 'Tank passed all checks. Next inspection due 2026-04-02' },
  { id: 'MNT-004', stationId: 'STA-004', station: 'Nakuru Highway', vehicleId: null, type: 'Canopy Lighting', description: 'LED canopy light replacement. 6 units failed.', priority: 'low', status: 'completed', contractorId: 'CON-004', assignedTech: 'Dan Maina', createdAt: '2025-04-15', scheduledDate: '2025-04-22', estimatedCompletion: '2025-04-23', actualCompletion: '2025-04-23', cost: 28000, invoiceNo: 'INV-20253105', notes: '' },
  { id: 'MNT-005', stationId: 'STA-002', station: 'Mombasa Port', vehicleId: 'VEH-004', type: 'Brake System', description: 'Service van brakes grinding. Full brake replacement required.', priority: 'critical', status: 'in-progress', contractorId: 'CON-001', assignedTech: 'Charles Ndegwa', createdAt: '2025-05-10', scheduledDate: '2025-05-11', estimatedCompletion: '2025-05-12', actualCompletion: null, cost: 55000, invoiceNo: null, notes: 'Vehicle off-road until complete' },
  { id: 'MNT-006', stationId: 'STA-006', station: 'Thika Road Mall', vehicleId: null, type: 'Fire Suppression', description: 'Annual fire suppression system service and certification.', priority: 'high', status: 'overdue', contractorId: null, assignedTech: null, createdAt: '2025-03-15', scheduledDate: '2025-04-15', estimatedCompletion: '2025-04-16', actualCompletion: null, cost: 120000, invoiceNo: null, notes: 'REMINDER: Regulatory requirement. License at risk.' },
]

export const mockContractors = [
  { id: 'CON-001', name: 'AutoMech Solutions Ltd', contact: 'Richard Mwangi', email: 'richard@automech.co.ke', phone: '+254 722 111 222', speciality: 'Vehicle Maintenance', rating: 4.8, activeJobs: 2, completedJobs: 45, contract: '2025-01-01', expiry: '2025-12-31', status: 'active', totalPaid: 2850000, certifications: ['ISO 9001', 'KEBS Certified'], region: 'Nairobi' },
  { id: 'CON-002', name: 'PetroTech Engineers', contact: 'Jane Kiprotich', email: 'jane@petrotech.co.ke', phone: '+254 733 222 333', speciality: 'Pump & Equipment', rating: 4.5, activeJobs: 1, completedJobs: 28, contract: '2025-01-01', expiry: '2025-12-31', status: 'active', totalPaid: 1450000, certifications: ['EPRA Licensed'], region: 'Nationwide' },
  { id: 'CON-003', name: 'SafeTank Inspections', contact: 'Dr. Alice Weru', email: 'alice@safetank.co.ke', phone: '+254 711 333 444', speciality: 'Tank Inspection & Compliance', rating: 4.9, activeJobs: 0, completedJobs: 62, contract: '2024-06-01', expiry: '2026-05-31', status: 'active', totalPaid: 3200000, certifications: ['NEMA', 'EPRA', 'ISO 14001'], region: 'Nationwide' },
  { id: 'CON-004', name: 'BrightSpace Electrical', contact: 'Kevin Ombundo', email: 'kevin@brightspace.co.ke', phone: '+254 744 444 555', speciality: 'Electrical & Lighting', rating: 4.2, activeJobs: 0, completedJobs: 18, contract: '2025-03-01', expiry: '2025-08-31', status: 'active', totalPaid: 380000, certifications: ['NCA Licensed'], region: 'Nairobi, Central' },
  { id: 'CON-005', name: 'FireShield Systems', contact: 'Martin Oloo', email: 'martin@fireshield.co.ke', phone: '+254 755 555 666', speciality: 'Fire Safety', rating: 3.8, activeJobs: 0, completedJobs: 9, contract: '2024-01-01', expiry: '2025-06-30', status: 'expiring', totalPaid: 680000, certifications: ['KFS Certified'], region: 'Coast, Nairobi' },
]

export const mockSuppliers = [
  { id: 'SUP-001', name: 'Kenya Petroleum Refineries', shortCode: 'KPR', contact: 'George Kamau', email: 'supply@kpr.co.ke', phone: '+254 20 600 1000', products: ['PMS', 'AGO', 'DPK'], paymentTerms: 'Net 30', creditLimit: 50000000, currentBalance: 18500000, lastDelivery: '2025-05-10', status: 'active', rating: 4.7, totalPurchases: 245000000, deliveryLeadTime: 2 },
  { id: 'SUP-002', name: 'TotalEnergies Kenya', shortCode: 'TEK', contact: 'Priya Sharma', email: 'priya.sharma@totalenergies.co.ke', phone: '+254 20 420 0000', products: ['PMS', 'AGO', 'LPG'], paymentTerms: 'Net 15', creditLimit: 30000000, currentBalance: 9200000, lastDelivery: '2025-05-08', status: 'active', rating: 4.9, totalPurchases: 112000000, deliveryLeadTime: 1 },
  { id: 'SUP-003', name: 'Vivo Energy Supply Chain', shortCode: 'VES', contact: 'Patrick Onyango', email: 'patrick.o@vivoenergy.com', phone: '+254 20 363 5000', products: ['PMS', 'AGO'], paymentTerms: 'Net 7', creditLimit: 20000000, currentBalance: 3800000, lastDelivery: '2025-04-30', status: 'active', rating: 4.3, totalPurchases: 78000000, deliveryLeadTime: 3 },
  { id: 'SUP-004', name: 'EPRA Approved Lubricants Co.', shortCode: 'EAL', contact: 'Rose Adhiambo', email: 'rose@epilubes.co.ke', phone: '+254 20 270 3300', products: ['Lubricants', 'Additives'], paymentTerms: 'Net 45', creditLimit: 5000000, currentBalance: 1200000, lastDelivery: '2025-04-15', status: 'active', rating: 4.1, totalPurchases: 12000000, deliveryLeadTime: 5 },
]

export const mockAlerts = [
  { id: 'ALT-001', type: 'fraud', severity: 'critical', title: 'Unusual variance — Garissa Junction T1', message: 'Tank T1 at Garissa Junction shows 3.0% unaccounted variance (450L) over 48 hours with zero sales recorded. Possible siphoning.', stationId: 'STA-007', station: 'Garissa Junction', date: '2025-05-12', status: 'active', assignedTo: null },
  { id: 'ALT-002', type: 'maintenance', severity: 'critical', title: 'Fire suppression system overdue', message: 'Thika Road Mall fire suppression annual service is 27 days overdue. License compliance at risk. Immediate action required.', stationId: 'STA-006', station: 'Thika Road Mall', date: '2025-05-12', status: 'active', assignedTo: 'Martin Oloo' },
  { id: 'ALT-003', type: 'tank', severity: 'warning', title: 'Low stock — Nairobi Central AGO', message: 'Tank T2 (AGO) at Nairobi Central is at 17% capacity (5,200L). Reorder recommended. Current burn rate: 3,240L/day.', stationId: 'STA-001', station: 'Nairobi Central', date: '2025-05-12', status: 'active', assignedTo: null },
  { id: 'ALT-004', type: 'fleet', severity: 'warning', title: 'Vehicle VEH-003 service overdue', message: 'KBZ 003C (Tanker) scheduled service was 2025-05-20 but is approaching. Vehicle at 210,050km. Service window opens in 10 days.', stationId: null, station: null, date: '2025-05-11', status: 'active', assignedTo: 'Mike Waweru' },
  { id: 'ALT-005', type: 'fraud', severity: 'high', title: 'Mombasa Port T1 — excess variance', message: 'Tank T1 (PMS) at Mombasa Port shows 1.96% variance above industry threshold of 0.5%. Pattern detected over 5 consecutive days.', stationId: 'STA-002', station: 'Mombasa Port', date: '2025-05-11', status: 'acknowledged', assignedTo: 'Amina Hassan' },
  { id: 'ALT-006', type: 'contractor', severity: 'info', title: 'FireShield contract expiring', message: 'FireShield Systems contract expires 2025-06-30. Renewal or alternative contractor sourcing required by 2025-06-01.', stationId: null, station: null, date: '2025-05-10', status: 'active', assignedTo: null },
  { id: 'ALT-007', type: 'transit', severity: 'warning', title: 'Transit loss detected — Route NBI-MSA', message: 'VEH-005 (KBZ 005E) loaded 45,000L PMS at depot. Delivery receipt: 44,320L. Loss of 680L (1.51%) on Nairobi-Mombasa route.', stationId: 'STA-002', station: 'Mombasa Port', date: '2025-05-10', status: 'active', assignedTo: null },
]

export const mockTransitLogs = [
  { id: 'TRN-001', vehicleId: 'VEH-001', plate: 'KBZ 001A', route: 'Nairobi Depot → Mombasa Port', product: 'AGO', loadedQty: 33000, deliveredQty: 32780, transitLoss: 220, lossPct: 0.67, driver: 'Moses Kariuki', depDate: '2025-05-10', arrDate: '2025-05-11', status: 'completed', causeNote: 'Within acceptable range', flagged: false },
  { id: 'TRN-002', vehicleId: 'VEH-005', plate: 'KBZ 005E', route: 'Nairobi Depot → Mombasa Port', product: 'PMS', loadedQty: 45000, deliveredQty: 44320, transitLoss: 680, lossPct: 1.51, driver: 'Tom Mutua', depDate: '2025-05-09', arrDate: '2025-05-10', status: 'completed', causeNote: 'Excess loss. Under investigation. Possible pilferage at Mtito stop.', flagged: true },
  { id: 'TRN-003', vehicleId: 'VEH-002', plate: 'KBZ 002B', route: 'Mombasa Depot → Nakuru Highway', product: 'PMS', loadedQty: 28000, deliveredQty: 27840, transitLoss: 160, lossPct: 0.57, driver: 'Paul Njoroge', depDate: '2025-05-08', arrDate: '2025-05-09', status: 'completed', causeNote: 'Within acceptable range', flagged: false },
  { id: 'TRN-004', vehicleId: 'VEH-003', plate: 'KBZ 003C', route: 'Nakuru Depot → Kisumu Lakeside', product: 'AGO', loadedQty: 33000, deliveredQty: 32640, transitLoss: 360, lossPct: 1.09, driver: 'Francis Omondi', depDate: '2025-05-07', arrDate: '2025-05-08', status: 'investigating', causeNote: 'Route deviation detected at Kericho. Stop not logged.', flagged: true },
  { id: 'TRN-005', vehicleId: 'VEH-006', plate: 'KBZ 006F', route: 'Nairobi Depot → Eldoret North', product: 'DPK', loadedQty: 28000, deliveredQty: 27910, transitLoss: 90, lossPct: 0.32, driver: 'Anna Muthoni', depDate: '2025-05-06', arrDate: '2025-05-07', status: 'completed', causeNote: 'Within acceptable range', flagged: false },
]

export const mockChartData = {
  monthlySales: [
    { month: 'Nov', pms: 3200000, ago: 2800000, dpk: 450000 },
    { month: 'Dec', pms: 3800000, ago: 3100000, dpk: 520000 },
    { month: 'Jan', pms: 3550000, ago: 2950000, dpk: 480000 },
    { month: 'Feb', pms: 3400000, ago: 2750000, dpk: 390000 },
    { month: 'Mar', pms: 3900000, ago: 3200000, dpk: 510000 },
    { month: 'Apr', pms: 4100000, ago: 3400000, dpk: 560000 },
    { month: 'May', pms: 2200000, ago: 1900000, dpk: 310000 },
  ],
  stationPerformance: [
    { name: 'Thika Rd', sales: 2160000, target: 2000000, efficiency: 108 },
    { name: 'Nakuru', sales: 1650000, target: 1500000, efficiency: 110 },
    { name: 'Nairobi Ctr', sales: 1350000, target: 1400000, efficiency: 96 },
    { name: 'Mombasa', sales: 1140000, target: 1200000, efficiency: 95 },
    { name: 'Kisumu', sales: 660000, target: 900000, efficiency: 73 },
    { name: 'Nyeri', sales: 840000, target: 800000, efficiency: 105 },
    { name: 'Eldoret', sales: 930000, target: 1000000, efficiency: 93 },
  ],
  transitLossHistory: [
    { month: 'Jan', loss: 1240, threshold: 500 },
    { month: 'Feb', loss: 890, threshold: 500 },
    { month: 'Mar', loss: 1560, threshold: 500 },
    { month: 'Apr', loss: 720, threshold: 500 },
    { month: 'May', loss: 1310, threshold: 500 },
  ],
  tankVariance: [
    { station: 'Garissa', variance: 3.0, limit: 0.5 },
    { station: 'Mombasa', variance: 1.96, limit: 0.5 },
    { station: 'Kisumu', variance: 1.45, limit: 0.5 },
    { station: 'Nairobi Ctr', variance: 0.34, limit: 0.5 },
    { station: 'Nakuru', variance: 0.4, limit: 0.5 },
    { station: 'Thika Rd', variance: 0.0, limit: 0.5 },
  ],
  maintenanceCosts: [
    { month: 'Jan', planned: 120000, unplanned: 85000 },
    { month: 'Feb', planned: 95000, unplanned: 210000 },
    { month: 'Mar', planned: 145000, unplanned: 45000 },
    { month: 'Apr', planned: 130000, unplanned: 28000 },
    { month: 'May', planned: 175000, unplanned: 55000 },
  ]
}
