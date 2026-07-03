import initSqlJs from 'sql.js'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'data.db')

let db = null
let SQL = null

function saveDb() {
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(DB_PATH, buffer)
}

function wrap(db) {
  function stmt(sql) {
    const s = db.prepare(sql)
    return {
      get(...params) {
        if (params.length) s.bind(params)
        const ok = s.step()
        const row = ok ? s.getAsObject() : null
        s.free()
        return row
      },
      all(...params) {
        if (params.length) s.bind(params)
        const rows = []
        while (s.step()) rows.push(s.getAsObject())
        s.free()
        return rows
      },
      run(...params) {
        if (params.length) s.bind(params)
        s.step()
        s.free()
        return { lastInsertRowid: db.exec("SELECT last_insert_rowid() as id")[0]?.values[0]?.[0] }
      }
    }
  }
  return {
    prepare: (sql) => stmt(sql),
    run: (sql, params) => { db.run(sql, params); saveDb() },
    exec: (sql) => { db.exec(sql); saveDb() },
    transaction: (fn) => (...args) => {
      db.exec('BEGIN TRANSACTION')
      try {
        const r = fn(...args)
        db.exec('COMMIT')
        saveDb()
        return r
      } catch (e) {
        db.exec('ROLLBACK')
        throw e
      }
    },
    export: () => db.export()
  }
}

let _initialized = false

export async function getDb() {
  if (_initialized) return db
  SQL = await initSqlJs()
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    db = wrap(new SQL.Database(buffer))
  } else {
    db = wrap(new SQL.Database())
    initSchema()
    seed()
    saveDb()
  }
  db.exec('PRAGMA foreign_keys = ON')
  _initialized = true
  return db
}

export function useDb() {
  if (!db) throw new Error('Database not initialized. Call getDb() first.')
  return db
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('guru_mapel','guru_piket','wali_kelas','admin')),
      mapel TEXT,
      waliKelas TEXT,
      createdAt TEXT DEFAULT (datetime('now','localtime'))
    );
    CREATE TABLE IF NOT EXISTS kelas (
      id TEXT PRIMARY KEY,
      tingkat TEXT NOT NULL,
      nama TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS mapel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS siswa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nis TEXT NOT NULL,
      nama TEXT NOT NULL,
      kelasId TEXT NOT NULL,
      FOREIGN KEY (kelasId) REFERENCES kelas(id)
    );
    CREATE TABLE IF NOT EXISTS presensi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tanggal TEXT NOT NULL,
      jam TEXT NOT NULL,
      tingkat TEXT NOT NULL,
      kelasId TEXT NOT NULL,
      mapelId INTEGER NOT NULL,
      siswaId INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('Hadir','Sakit','Izin','Alpa')),
      foto TEXT,
      timestamp TEXT DEFAULT (datetime('now','localtime')),
      userId INTEGER,
      FOREIGN KEY (kelasId) REFERENCES kelas(id),
      FOREIGN KEY (mapelId) REFERENCES mapel(id),
      FOREIGN KEY (siswaId) REFERENCES siswa(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS penempatan_guru (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guruId INTEGER NOT NULL,
      mapelId INTEGER NOT NULL,
      kelasId TEXT NOT NULL,
      tahunAjaran TEXT NOT NULL,
      createdAt TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (guruId) REFERENCES users(id),
      FOREIGN KEY (mapelId) REFERENCES mapel(id),
      FOREIGN KEY (kelasId) REFERENCES kelas(id),
      UNIQUE(guruId, mapelId, kelasId, tahunAjaran)
    );
    CREATE INDEX IF NOT EXISTS idx_presensi_tanggal ON presensi(tanggal);
    CREATE INDEX IF NOT EXISTS idx_presensi_kelas ON presensi(kelasId);
    CREATE INDEX IF NOT EXISTS idx_presensi_siswa ON presensi(siswaId);
    CREATE INDEX IF NOT EXISTS idx_penempatan_guru ON penempatan_guru(guruId, tahunAjaran);
  `)
}

function seed() {
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get()
  if (userCount.c > 0) return

  const hash = bcrypt.hashSync('123', 10)
  const users = [
    [1, 'guru.mapel', hash, 'Ahmad Fauzi, S.Pd.', 'guru_mapel', 'Matematika', null],
    [2, 'guru.piket', hash, 'Siti Rahma, S.Pd.', 'guru_piket', null, null],
    [3, 'wali.kelas', hash, 'Dewi Sartika, S.Pd.', 'wali_kelas', null, '7A'],
    [4, 'admin', hash, 'Administrator', 'admin', null, null],
  ]
  for (const u of users) {
    db.run('INSERT INTO users (id, username, password, name, role, mapel, waliKelas) VALUES (?, ?, ?, ?, ?, ?, ?)', u)
  }

  for (const k of ['7A','7B','8A','8B','9A','9B']) {
    db.run('INSERT INTO kelas (id, tingkat, nama) VALUES (?, ?, ?)', [k, k[0], k])
  }

  const mapels = ['Matematika','Bahasa Indonesia','Bahasa Inggris','IPA','IPS','Pendidikan Agama Islam','PKN']
  mapels.forEach((m, i) => db.run('INSERT INTO mapel (id, nama) VALUES (?, ?)', [i + 1, m]))

  const siswaData = [
    [1,'1234561','Adi Pratama','7A'],[2,'1234562','Budi Santoso','7A'],[3,'1234563','Citra Dewi','7A'],[4,'1234564','Dian Permata','7A'],[5,'1234565','Eko Prasetyo','7A'],
    [6,'1234566','Fitri Handayani','7B'],[7,'1234567','Galih Saputra','7B'],[8,'1234568','Hesti Purnama','7B'],[9,'1234569','Indra Wijaya','7B'],[10,'1234570','Joko Susilo','7B'],
    [11,'1234571','Kartika Sari','8A'],[12,'1234572','Luki Hermawan','8A'],[13,'1234573','Maya Anggraini','8A'],[14,'1234574','Nanda Putra','8A'],[15,'1234575','Oki Firmansyah','8A'],
    [16,'1234576','Putri Ayu','8B'],[17,'1234577','Rizky Ramadhan','8B'],[18,'1234578','Sari Wulandari','8B'],[19,'1234579','Teguh Pratomo','8B'],[20,'1234580','Umi Kalsum','8B'],
    [21,'1234581','Vina Amalia','9A'],[22,'1234582','Wahyu Nugroho','9A'],[23,'1234583','Xena Yunita','9A'],[24,'1234584','Yoga Aditya','9A'],[25,'1234585','Zara Azizah','9A'],
    [26,'1234586','Agus Setiawan','9B'],[27,'1234587','Bella Octavia','9B'],[28,'1234588','Candra Gunawan','9B'],[29,'1234589','Dini Apriani','9B'],[30,'1234590','Erik Susanto','9B'],
  ]
  for (const s of siswaData) {
    db.run('INSERT INTO siswa (id, nis, nama, kelasId) VALUES (?, ?, ?, ?)', s)
  }

  const tahun = getTahunAjaran()
  db.run('INSERT INTO penempatan_guru (guruId, mapelId, kelasId, tahunAjaran) VALUES (?, ?, ?, ?)', [1, 1, '7A', tahun])
  db.run('INSERT INTO penempatan_guru (guruId, mapelId, kelasId, tahunAjaran) VALUES (?, ?, ?, ?)', [1, 1, '7B', tahun])
}

export function getTahunAjaran() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  if (month >= 7) return `${year}/${year + 1}`
  return `${year - 1}/${year}`
}

export function closeDb() {
  if (db) { saveDb(); db = null }
}
