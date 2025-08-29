// src/services/service.js
import { db } from "../config/firebase"; // ajustá la ruta si tuvieras otra
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const COL = "services";

/**
 * Crea un servicio.
 * @param {{title:string, description?:string, price?:number, active?:boolean, imageUrl?:string}} data
 * @returns {Promise<string>} id del documento creado
 */
export async function createService(data) {
  const ref = collection(db, COL);
  const snap = await addDoc(ref, {
    title: data.title,
    description: data.description || "",
    price: typeof data.price === "number" ? data.price : null,
    active: typeof data.active === "boolean" ? data.active : true,
    imageUrl: data.imageUrl || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return snap.id;
}

/**
 * Obtiene todos los servicios (ordenados por fecha de creación desc).
 * @returns {Promise<Array<{id:string, title:string, ...}>>}
 */
export async function getAllServices() {
  const ref = collection(db, COL);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Lee un servicio por id.
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export async function getServiceById(id) {
  const dref = doc(db, COL, id);
  const snap = await getDoc(dref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Actualiza un servicio.
 * @param {string} id
 * @param {Partial<{title:string, description:string, price:number, active:boolean, imageUrl:string}>} data
 * @returns {Promise<void>}
 */
export async function updateService(id, data) {
  const dref = doc(db, COL, id);
  await updateDoc(dref, { ...data, updatedAt: serverTimestamp() });
}

/**
 * Elimina un servicio.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteService(id) {
  const dref = doc(db, COL, id);
  await deleteDoc(dref);
}

/**
 * Suscripción en tiempo real (opcional).
 * Devuelve la función para desuscribirse.
 * @param {(items: Array<object>) => void} callback
 * @returns {() => void}
 */
export function subscribeServices(callback) {
  const ref = collection(db, COL);
  const q = query(ref, orderBy("createdAt", "desc"));
  const unsub = onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
  return unsub;
}
