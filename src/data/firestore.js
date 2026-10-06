import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  runTransaction,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

// =========================
// USERS
// =========================

export async function createUserProfile({
  uid,
  email,
  displayName,
  photoURL,
}) {
  if (!uid) {
    throw new Error("UID tidak ditemukan.");
  }

  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid,
      email: email || "",
      displayName: displayName || "",
      photoURL: photoURL || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return;
  }

  await updateDoc(userRef, {
    email: email || "",
    displayName: displayName || "",
    photoURL: photoURL || "",
    updatedAt: serverTimestamp(),
  });
}

export async function getUsers() {
  const usersRef = collection(db, "users");

  const usersQuery = query(
    usersRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(usersQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function deleteUser(uid) {
  if (!uid) {
    throw new Error("UID user tidak ditemukan.");
  }

  await deleteDoc(
    doc(db, "users", uid)
  );
}

// =========================
// ADMINS
// =========================

export async function isAdmin(email) {
  if (!email) return false;

  const normalizedEmail = email
    .trim()
    .toLowerCase();

  const adminRef = doc(
    db,
    "admins",
    normalizedEmail
  );

  const snapshot = await getDoc(adminRef);

  return snapshot.exists();
}

export async function getAdmins() {
  const adminsRef = collection(
    db,
    "admins"
  );

  const snapshot = await getDocs(
    adminsRef
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function addAdmin({
  email,
  addedBy,
}) {
  if (!email) {
    throw new Error(
      "Email admin wajib diisi."
    );
  }

  const normalizedEmail = email
    .trim()
    .toLowerCase();

  await setDoc(
    doc(
      db,
      "admins",
      normalizedEmail
    ),
    {
      email: normalizedEmail,
      role: "admin",
      addedBy: addedBy || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return normalizedEmail;
}

export async function removeAdmin(email) {
  if (!email) {
    throw new Error(
      "Email admin tidak ditemukan."
    );
  }

  const normalizedEmail = email
    .trim()
    .toLowerCase();

  await deleteDoc(
    doc(
      db,
      "admins",
      normalizedEmail
    )
  );
}

// =========================
// PRODUCTS
// =========================

export async function getProducts() {
  const productsRef = collection(
    db,
    "products"
  );

  const productsQuery = query(
    productsRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(
    productsQuery
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function addProduct(
  productData
) {
  const productsRef = collection(
    db,
    "products"
  );

  const docRef = await addDoc(
    productsRef,
    {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return docRef.id;
}

export async function updateProduct(
  productId,
  productData
) {
  if (!productId) {
    throw new Error(
      "Product ID tidak ditemukan."
    );
  }

  await updateDoc(
    doc(db, "products", productId),
    {
      ...productData,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function deleteProduct(
  productId
) {
  if (!productId) {
    throw new Error(
      "Product ID tidak ditemukan."
    );
  }

  await deleteDoc(
    doc(db, "products", productId)
  );
}

// =========================
// GAMES
// =========================

export async function getGames() {
  const gamesRef = collection(
    db,
    "games"
  );

  const gamesQuery = query(
    gamesRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(
    gamesQuery
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function addGame(
  gameData
) {
  const gamesRef = collection(
    db,
    "games"
  );

  const docRef = await addDoc(
    gamesRef,
    {
      ...gameData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return docRef.id;
}

export async function updateGame(
  gameId,
  gameData
) {
  if (!gameId) {
    throw new Error(
      "Game ID tidak ditemukan."
    );
  }

  await updateDoc(
    doc(db, "games", gameId),
    {
      ...gameData,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function deleteGame(
  gameId
) {
  if (!gameId) {
    throw new Error(
      "Game ID tidak ditemukan."
    );
  }

  await deleteDoc(
    doc(db, "games", gameId)
  );
}

// =========================
// CATEGORIES
// =========================

export async function getCategories() {
  const categoriesRef =
    collection(
      db,
      "categories"
    );

  const categoriesQuery = query(
    categoriesRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(
    categoriesQuery
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function addCategory(
  categoryData
) {
  const categoriesRef =
    collection(
      db,
      "categories"
    );

  const docRef = await addDoc(
    categoriesRef,
    {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return docRef.id;
}

export async function updateCategory(
  categoryId,
  categoryData
) {
  if (!categoryId) {
    throw new Error(
      "Category ID tidak ditemukan."
    );
  }

  await updateDoc(
    doc(
      db,
      "categories",
      categoryId
    ),
    {
      ...categoryData,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function deleteCategory(
  categoryId
) {
  if (!categoryId) {
    throw new Error(
      "Category ID tidak ditemukan."
    );
  }

  await deleteDoc(
    doc(
      db,
      "categories",
      categoryId
    )
  );
}

// =========================
// ORDERS
// =========================

export async function createOrder(
  orderData
) {
  if (!orderData?.email) {
    throw new Error(
      "Email customer wajib ada."
    );
  }

  const ordersRef = collection(
    db,
    "orders"
  );

  const docRef = await addDoc(
    ordersRef,
    {
      ...orderData,
      status:
        orderData.status ||
        "pending",
      createdAt:
        serverTimestamp(),
    }
  );

  return docRef.id;
}

export async function getOrders() {
  const ordersRef = collection(
    db,
    "orders"
  );

  const ordersQuery = query(
    ordersRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(
    ordersQuery
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function updateOrder(
  orderId,
  orderData
) {
  if (!orderId) {
    throw new Error(
      "Order ID tidak ditemukan."
    );
  }

  await updateDoc(
    doc(db, "orders", orderId),
    {
      ...orderData,
      updatedAt:
        serverTimestamp(),
    }
  );
}

export async function deleteOrder(
  orderId
) {
  if (!orderId) {
    throw new Error(
      "Order ID tidak ditemukan."
    );
  }

  await deleteDoc(
    doc(db, "orders", orderId)
  );
}

// =========================
// PAYMENTS
// =========================

export async function getPayments() {
  const paymentsRef =
    collection(db, "payments");

  const paymentsQuery = query(
    paymentsRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(
    paymentsQuery
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function createPayment(
  paymentData
) {
  if (!paymentData?.email) {
    throw new Error(
      "Email customer wajib ada."
    );
  }

  const paymentsRef =
    collection(db, "payments");

  const docRef = await addDoc(
    paymentsRef,
    {
      ...paymentData,
      status:
        paymentData.status ||
        "pending",
      createdAt:
        serverTimestamp(),
    }
  );

  return docRef.id;
}

export async function updatePayment(
  paymentId,
  paymentData
) {
  if (!paymentId) {
    throw new Error(
      "Payment ID tidak ditemukan."
    );
  }

  await updateDoc(
    doc(db, "payments", paymentId),
    {
      ...paymentData,
      updatedAt:
        serverTimestamp(),
    }
  );
}

export async function deletePayment(
  paymentId
) {
  if (!paymentId) {
    throw new Error(
      "Payment ID tidak ditemukan."
    );
  }

  await deleteDoc(
    doc(db, "payments", paymentId)
  );
}

// =========================
// VIP MEMBERS
// =========================

export async function getVipMember(
  email
) {
  if (!email) return null;

  const normalizedEmail = email
    .trim()
    .toLowerCase();

  const vipRef = doc(
    db,
    "vipMembers",
    normalizedEmail
  );

  const snapshot = await getDoc(
    vipRef
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function isUserVip(
  email
) {
  const vipMember =
    await getVipMember(email);

  if (!vipMember) return false;

  return (
    vipMember.status ===
    "active"
  );
}

export async function addVipMember({
  email,
  adminEmail,
}) {
  if (!email) {
    throw new Error(
      "Email VIP wajib diisi."
    );
  }

  const normalizedEmail = email
    .trim()
    .toLowerCase();

  await setDoc(
    doc(
      db,
      "vipMembers",
      normalizedEmail
    ),
    {
      email: normalizedEmail,
      status: "active",
      activatedAt:
        serverTimestamp(),
      addedBy:
        adminEmail || null,
      updatedAt:
        serverTimestamp(),
    }
  );

  return normalizedEmail;
}

export async function removeVipMember(
  email
) {
  if (!email) {
    throw new Error(
      "Email VIP tidak ditemukan."
    );
  }

  await setDoc(
    doc(
      db,
      "vipMembers",
      email
        .trim()
        .toLowerCase()
    ),
    {
      status: "inactive",
      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

export async function getVipMembers() {
  const vipRef =
    collection(
      db,
      "vipMembers"
    );

  const vipQuery = query(
    vipRef,
    where(
      "status",
      "==",
      "active"
    )
  );

  const snapshot = await getDocs(
    vipQuery
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

// =========================
// VIP PAYMENTS
// =========================

export async function createVipPayment(
  paymentData
) {
  if (!paymentData?.email) {
    throw new Error(
      "Email customer wajib ada."
    );
  }

  const paymentsRef =
    collection(
      db,
      "vipPayments"
    );

  const docRef = await addDoc(
    paymentsRef,
    {
      ...paymentData,
      amount: 30000,
      status: "pending",
      createdAt:
        serverTimestamp(),
    }
  );

  return docRef.id;
}

export async function getVipPayments() {
  const paymentsRef =
    collection(
      db,
      "vipPayments"
    );

  const paymentsQuery = query(
    paymentsRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(
    paymentsQuery
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function updateVipPayment(
  paymentId,
  paymentData
) {
  if (!paymentId) {
    throw new Error(
      "VIP Payment ID tidak ditemukan."
    );
  }

  await updateDoc(
    doc(
      db,
      "vipPayments",
      paymentId
    ),
    {
      ...paymentData,
      updatedAt:
        serverTimestamp(),
    }
  );
}

export async function deleteVipPayment(
  paymentId
) {
  if (!paymentId) {
    throw new Error(
      "VIP Payment ID tidak ditemukan."
    );
  }

  await deleteDoc(
    doc(
      db,
      "vipPayments",
      paymentId
    )
  );
}

// =========================
// SETTINGS
// =========================

export async function getSettings() {
  const settingsRef = doc(
    db,
    "settings",
    "general"
  );

  const snapshot = await getDoc(
    settingsRef
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function saveSettings(
  settingsData
) {
  const settingsRef = doc(
    db,
    "settings",
    "general"
  );

  await setDoc(
    settingsRef,
    {
      ...settingsData,
      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

// =========================
// ACCOUNT INVENTORY (V3)
// =========================

export async function getAccountStock(productId = null) {
  const ref = collection(db, "accountStock");
  const q = productId
    ? query(ref, where("productId", "==", productId))
    : ref;
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function addAccountStock({ productId, username, password, extraInfo = "" }) {
  if (!productId || !username || !password) {
    throw new Error("Produk, username/email, dan password wajib diisi.");
  }
  const ref = await addDoc(collection(db, "accountStock"), {
    productId,
    username: username.trim(),
    password,
    extraInfo: extraInfo.trim(),
    status: "available",
    soldTo: "",
    orderId: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteAccountStock(accountId) {
  if (!accountId) throw new Error("ID akun tidak ditemukan.");
  await deleteDoc(doc(db, "accountStock", accountId));
}

export async function getMyAccounts(uid) {
  if (!uid) return [];
  const snapshot = await getDocs(
    query(collection(db, "accountStock"), where("soldTo", "==", uid), where("status", "==", "sold"))
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function approveOrder(orderId, adminEmail = "") {
  if (!orderId) throw new Error("Order ID tidak ditemukan.");

  const orderRef = doc(db, "orders", orderId);

  return runTransaction(db, async (transaction) => {
    const orderSnap = await transaction.get(orderRef);
    if (!orderSnap.exists()) throw new Error("Pesanan tidak ditemukan.");

    const order = orderSnap.data();
    if (order.status === "completed") return { ...order, id: orderId };

    if (!order.isAccount) {
      transaction.update(orderRef, {
        status: "completed",
        paymentProofStatus: "approved",
        approvedBy: adminEmail,
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { ...order, id: orderId, status: "completed" };
    }

    const stockSnapshot = await getDocs(
      query(
        collection(db, "accountStock"),
        where("productId", "==", order.productId),
        where("status", "==", "available")
      )
    );

    if (stockSnapshot.empty) {
      throw new Error("Stok akun habis. Pesanan belum di-approve.");
    }

    // Re-read the selected document inside the transaction so concurrent
    // approval cannot sell the same stock item twice.
    const accountRef = stockSnapshot.docs[0].ref;
    const accountSnap = await transaction.get(accountRef);
    if (!accountSnap.exists() || accountSnap.data().status !== "available") {
      throw new Error("Stok akun baru saja diambil. Silakan approve lagi.");
    }

    transaction.update(accountRef, {
      status: "sold",
      soldTo: order.uid || "",
      orderId,
      soldAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    transaction.update(orderRef, {
      status: "completed",
      paymentProofStatus: "approved",
      accountId: accountRef.id,
      accountDeliveryStatus: "delivered",
      approvedBy: adminEmail,
      approvedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      ...order,
      id: orderId,
      status: "completed",
      accountId: accountRef.id,
      accountDeliveryStatus: "delivered",
    };
  });
}
