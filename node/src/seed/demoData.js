const demoUser = {
  name: 'Maria Clara Souza',
  email: 'maria.clara@example.com',
  password: 'senha123',
  phone: '21998123456',
  cpf: '94034074094',
  bairro: 'Copacabana',
  location: 'Copacabana, Rio de Janeiro - RJ',
  avatar: 'MC',
  bio: 'Doadora recorrente no DoaFacil.',
  verified: true,
  roles: ['doador', 'receptor']
};

const mariaDonationItems = [
  { title: 'Sofa de 3 lugares', description: 'Sofa em tecido cinza, leve desgaste nos bracos, estrutura firme.', category: 'moveis', condition: 'bom', location: 'Copacabana, RJ', status: 'disponivel', images: ['./assets/img/items/item1.jpg'], dimensions: '220 x 85 x 90 cm', material: 'Tecido / Madeira', color: 'Cinza claro', pickup: 'A combinar', address: { neighborhood: 'Copacabana', city: 'Rio de Janeiro' } },
  { title: 'Guarda-roupa 4 portas', description: 'Madeira clara, espelho interno, sem trincas.', category: 'moveis', condition: 'bom', location: 'Botafogo, RJ', status: 'cancelado', images: ['./assets/img/items/item2.jpg'], dimensions: '', material: 'Madeira', color: 'Madeira clara', pickup: 'A combinar', address: { neighborhood: 'Botafogo', city: 'Rio de Janeiro' } },
  { title: 'Micro-ondas 30L', description: 'Funcionando perfeitamente, acompanha prato giratorio.', category: 'eletro', condition: 'otimo', location: 'Tijuca, RJ', status: 'reservado', images: ['./assets/img/items/item3.jpg'], dimensions: '', material: '', color: '', pickup: 'A combinar', address: { neighborhood: 'Tijuca', city: 'Rio de Janeiro' } },
  { title: 'Kit roupas infantis', description: 'Tamanhos 4 a 8 anos, varias pecas, bem conservadas.', category: 'roupas', condition: 'otimo', location: 'Meier, RJ', status: 'concluido', images: ['./assets/img/items/item4.jpg'], dimensions: '', material: '', color: 'Variadas', pickup: 'A combinar', address: { neighborhood: 'Meier', city: 'Rio de Janeiro' } },
  { title: 'Mesa de escritorio', description: 'Mesa retangular 120x60cm, arranhoes superficiais.', category: 'moveis', condition: 'usado', location: 'Centro, RJ', status: 'concluido', images: ['./assets/img/items/item5.jpg'], dimensions: '120 x 60 cm', material: 'Madeira', color: '', pickup: 'A combinar', address: { neighborhood: 'Centro', city: 'Rio de Janeiro' } },
  { title: 'Conjunto de panelas', description: '5 pecas, antiaderente, sem lascas. Cabos firmes.', category: 'utensilios', condition: 'bom', location: 'Realengo, RJ', status: 'concluido', images: ['./assets/img/items/item6.jpg'], dimensions: '', material: 'Antiaderente', color: '', pickup: 'A combinar', address: { neighborhood: 'Realengo', city: 'Rio de Janeiro' } },
  { title: 'Tenis esportivo 42', description: 'Pouco uso, solado em bom estado.', category: 'calcados', condition: 'bom', location: 'Jacarepagua, RJ', status: 'concluido', images: ['./assets/img/items/item7.jpg'], dimensions: '42', material: '', color: '', pickup: 'A combinar', address: { neighborhood: 'Jacarepagua', city: 'Rio de Janeiro' } },
  { title: 'Livros didaticos', description: 'Ensino medio, completos, sem anotacoes.', category: 'escolar', condition: 'otimo', location: 'Vila Isabel', status: 'concluido', images: ['./assets/img/items/item8.jpg'], dimensions: '', material: 'Papel', color: '', pickup: 'A combinar', address: { neighborhood: 'Vila Isabel', city: 'Rio de Janeiro' } },
  { title: 'Cama solteiro', description: 'Cama de madeira com colchao incluso, sem mofos.', category: 'moveis', condition: 'bom', location: 'Bonsucesso', status: 'concluido', images: ['./assets/img/items/item9.jpg'], dimensions: '', material: 'Madeira', color: '', pickup: 'A combinar', address: { neighborhood: 'Bonsucesso', city: 'Rio de Janeiro' } },
  { title: 'Brinquedos variados', description: 'Caixinha com quebra-cabecas, carrinhos e bonecas.', category: 'brinquedos', condition: 'bom', location: 'Sulacap', status: 'concluido', images: ['./assets/img/items/item10.jpg'], dimensions: '', material: '', color: 'Variadas', pickup: 'A combinar', address: { neighborhood: 'Sulacap', city: 'Rio de Janeiro' } },
  { title: 'Geladeira 280L', description: 'Funciona bem, pequenas marcas externas.', category: 'eletro', condition: 'usado', location: 'Bangu', status: 'concluido', images: ['./assets/img/items/item11.jpg'], dimensions: '280L', material: '', color: '', pickup: 'A combinar', address: { neighborhood: 'Bangu', city: 'Rio de Janeiro' } },
  { title: 'Mochila escolar', description: 'Nova, nunca usada, tamanho medio.', category: 'escolar', condition: 'otimo', location: 'Santa Cruz, RJ', status: 'concluido', images: ['./assets/img/items/item12.jpg'], dimensions: 'Tamanho medio', material: '', color: '', pickup: 'A combinar', address: { neighborhood: 'Santa Cruz', city: 'Rio de Janeiro' } }
];

const mariaDonationReceivers = [
  { name: 'Ana Lima', email: 'ana.lima.demo@example.com', cpf: '11111111111', bairro: 'Tijuca' },
  { name: 'ONG Recomeco', email: 'ong.recomeco.demo@example.com', cpf: '22222222222', bairro: 'Meier' },
  { name: 'Joao Alves', email: 'joao.alves.demo@example.com', cpf: '33333333333', bairro: 'Centro' },
  { name: 'Projeto ABC', email: 'projeto.abc.demo@example.com', cpf: '44444444444', bairro: 'Vila Isabel' },
  { name: 'Fernanda R.', email: 'fernanda.r.demo@example.com', cpf: '55555555555', bairro: 'Realengo' },
  { name: 'Lucas T.', email: 'lucas.t.demo@example.com', cpf: '66666666666', bairro: 'Jacarepagua' },
  { name: 'Casa Crianca', email: 'casa.crianca.demo@example.com', cpf: '77777777777', bairro: 'Sulacap' },
  { name: 'Silvia N.', email: 'silvia.n.demo@example.com', cpf: '88888888888', bairro: 'Bonsucesso' },
  { name: 'Pedro S.', email: 'pedro.s.demo@example.com', cpf: '99999999999', bairro: 'Botafogo' },
  { name: 'Inst. Educar', email: 'inst.educar.demo@example.com', cpf: '12345678901', bairro: 'Santa Cruz' },
  { name: 'Maria F.', email: 'maria.f.demo@example.com', cpf: '23456789012', bairro: 'Bangu' }
];

const mariaDonationReservationRows = [
  { itemTitle: 'Micro-ondas 30L', receiverEmail: 'ana.lima.demo@example.com', status: 'pendente', date: '2026-05-12T12:00:00-03:00' },
  { itemTitle: 'Kit roupas infantis', receiverEmail: 'ong.recomeco.demo@example.com', status: 'concluida', date: '2026-05-08T12:00:00-03:00' },
  { itemTitle: 'Mesa de escritorio', receiverEmail: 'joao.alves.demo@example.com', status: 'concluida', date: '2026-05-02T12:00:00-03:00' },
  { itemTitle: 'Livros didaticos', receiverEmail: 'projeto.abc.demo@example.com', status: 'concluida', date: '2026-04-28T12:00:00-03:00' },
  { itemTitle: 'Conjunto de panelas', receiverEmail: 'fernanda.r.demo@example.com', status: 'concluida', date: '2026-04-22T12:00:00-03:00' },
  { itemTitle: 'Tenis esportivo 42', receiverEmail: 'lucas.t.demo@example.com', status: 'concluida', date: '2026-04-15T12:00:00-03:00' },
  { itemTitle: 'Brinquedos variados', receiverEmail: 'casa.crianca.demo@example.com', status: 'concluida', date: '2026-04-10T12:00:00-03:00' },
  { itemTitle: 'Cama solteiro', receiverEmail: 'silvia.n.demo@example.com', status: 'concluida', date: '2026-04-03T12:00:00-03:00' },
  { itemTitle: 'Guarda-roupa 4 portas', receiverEmail: 'pedro.s.demo@example.com', status: 'cancelada', date: '2026-03-28T12:00:00-03:00' },
  { itemTitle: 'Mochila escolar', receiverEmail: 'inst.educar.demo@example.com', status: 'concluida', date: '2026-03-20T12:00:00-03:00' },
  { itemTitle: 'Geladeira 280L', receiverEmail: 'maria.f.demo@example.com', status: 'concluida', date: '2026-03-14T12:00:00-03:00' }
];

const mariaReceivedDonors = [
  { name: 'Lara C.', email: 'lara.c.demo@example.com', cpf: '34567890123', bairro: 'Centro' },
  { name: 'Roberto S.', email: 'roberto.s.demo@example.com', cpf: '45678901234', bairro: 'Vila Isabel' },
  { name: 'Ana P.', email: 'ana.p.demo@example.com', cpf: '56789012345', bairro: 'Meier' },
  { name: 'Carlos M.', email: 'carlos.m.demo@example.com', cpf: '67890123456', bairro: 'Realengo' },
  { name: 'Vera N.', email: 'vera.n.demo@example.com', cpf: '78901234567', bairro: 'Santa Cruz' },
  { name: 'Inst.Vida', email: 'inst.vida.demo@example.com', cpf: '89012345678', bairro: 'Sulacap' },
  { name: 'Hugo B.', email: 'hugo.b.demo@example.com', cpf: '90123456789', bairro: 'Botafogo' }
];

const mariaReceivedItems = [
  { title: 'Mesa escritorio', donorEmail: 'lara.c.demo@example.com', description: 'Mesa recebida em bom estado para uso domestico.', category: 'moveis', condition: 'usado', location: 'Centro, RJ', status: 'concluido', images: ['./assets/img/items/item5.jpg'], date: '2026-04-25T12:00:00-03:00' },
  { title: 'Livros didaticos recebidos', donorEmail: 'roberto.s.demo@example.com', description: 'Colecao de livros didaticos recebida pela usuaria.', category: 'escolar', condition: 'otimo', location: 'Vila Isabel, RJ', status: 'concluido', images: ['./assets/img/items/item8.jpg'], date: '2026-04-18T12:00:00-03:00' },
  { title: 'Roupas tamanho M (lote)', donorEmail: 'ana.p.demo@example.com', description: 'Lote de roupas tamanho M recebido em boas condicoes.', category: 'roupas', condition: 'bom', location: 'Meier, RJ', status: 'concluido', images: ['./assets/img/items/item4.jpg'], date: '2026-04-10T12:00:00-03:00' },
  { title: 'Frigideira antiaderente', donorEmail: 'carlos.m.demo@example.com', description: 'Frigideira antiaderente recebida sem lascas.', category: 'utensilios', condition: 'bom', location: 'Realengo, RJ', status: 'concluido', images: ['./assets/img/items/item6.jpg'], date: '2026-04-01T12:00:00-03:00' },
  { title: 'Mochila infantil', donorEmail: 'vera.n.demo@example.com', description: 'Mochila infantil recebida para uso escolar.', category: 'escolar', condition: 'bom', location: 'Santa Cruz, RJ', status: 'concluido', images: ['./assets/img/items/item12.jpg'], date: '2026-03-22T12:00:00-03:00' },
  { title: 'Kit brinquedos', donorEmail: 'inst.vida.demo@example.com', description: 'Kit com brinquedos variados recebido.', category: 'brinquedos', condition: 'bom', location: 'Sulacap, RJ', status: 'concluido', images: ['./assets/img/items/item10.jpg'], date: '2026-03-15T12:00:00-03:00' },
  { title: 'Poltrona de leitura', donorEmail: 'hugo.b.demo@example.com', description: 'Poltrona de leitura reservada para retirada.', category: 'moveis', condition: 'bom', location: 'Botafogo, RJ', status: 'reservado', images: ['./assets/img/items/item1.jpg'], date: '2026-03-05T12:00:00-03:00' }
];

const demoItems = mariaDonationItems;
const demoReceivers = mariaDonationReceivers;
const demoReservationRows = mariaDonationReservationRows;

function buildDemoItemsForDonor(donorId) {
  return mariaDonationItems.map((item) => ({ ...item, donor_id: donorId }));
}

function statusToReservationStatus(status) {
  if (status === 'reservado') return 'pendente';
  if (status === 'cancelado') return 'cancelada';
  if (status === 'concluido') return 'concluida';
  return status;
}

async function ensureUser(User, userData) {
  let user = await User.findOne({ where: { email: userData.email } });
  const defaults = {
    password: 'senha123',
    phone: '21990000000',
    location: (userData.bairro || 'Rio de Janeiro') + ', Rio de Janeiro - RJ',
    avatar: userData.name.slice(0, 2).toUpperCase(),
    verified: false,
    roles: ['receptor']
  };

  if (!user) {
    user = await User.create({ ...defaults, ...userData });
  } else {
    const fields = ['name', 'phone', 'cpf', 'bairro', 'location', 'avatar', 'bio', 'verified', 'roles'];
    let changed = false;
    for (const field of fields) {
      if (Object.prototype.hasOwnProperty.call(userData, field) && JSON.stringify(user[field]) !== JSON.stringify(userData[field])) {
        user[field] = userData[field];
        changed = true;
      }
    }
    if (changed) await user.save();
  }
  return user;
}

async function ensureItem(Item, itemData, donorId) {
  let item = await Item.findOne({ where: { title: itemData.title, donor_id: donorId } });
  const payload = { ...itemData, donor_id: donorId };
  if (!item) {
    item = await Item.create(payload);
    return { item, created: true };
  }

  const fields = ['description', 'category', 'emoji', 'condition', 'location', 'status', 'images', 'dimensions', 'material', 'color', 'pickup', 'address'];
  let changed = false;
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(payload, field) && JSON.stringify(item[field]) !== JSON.stringify(payload[field])) {
      item[field] = payload[field];
      changed = true;
    }
  }
  if (changed) await item.save();
  return { item, created: false };
}

async function ensureDemoItems(Item, maria) {
  let createdItems = 0;
  const itemsByTitle = new Map();
  for (const itemData of buildDemoItemsForDonor(maria.id)) {
    const { item, created } = await ensureItem(Item, itemData, maria.id);
    if (created) createdItems += 1;
    itemsByTitle.set(item.title, item);
  }
  return { createdItems, itemsByTitle };
}

async function ensureReservation(Reservation, data) {
  let reservation = await Reservation.findOne({ where: { item_id: data.item_id, user_id: data.user_id, donor_id: data.donor_id } });
  if (!reservation) {
    reservation = await Reservation.create(data);
    return { reservation, created: true };
  }

  const fields = ['status', 'message', 'completed_at', 'createdAt', 'updatedAt'];
  let changed = false;
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(data, field) && String(reservation[field] || '') !== String(data[field] || '')) {
      reservation[field] = data[field];
      changed = true;
    }
  }
  if (changed) await reservation.save();
  return { reservation, created: false };
}

async function ensureHistory(History, data) {
  const existingHistory = await History.findOne({
    where: { item_id: data.item_id, donor_id: data.donor_id, receiver_id: data.receiver_id, transaction_type: data.transaction_type }
  });
  if (existingHistory) return false;
  await History.create(data);
  return true;
}

async function ensureDemoReservationsAndHistory({ Item, Reservation, History }, maria, receiversByEmail, itemsByTitle) {
  if (!Reservation || !History) return { createdReservations: 0, createdHistory: 0 };
  let createdReservations = 0;
  let createdHistory = 0;

  for (const row of mariaDonationReservationRows) {
    const item = itemsByTitle.get(row.itemTitle) || await Item.findOne({ where: { title: row.itemTitle, donor_id: maria.id } });
    const receiver = receiversByEmail.get(row.receiverEmail);
    if (!item || !receiver) continue;

    const eventDate = new Date(row.date);
    const { created } = await ensureReservation(Reservation, {
      item_id: item.id,
      user_id: receiver.id,
      donor_id: maria.id,
      status: row.status,
      message: 'Registro demonstrativo criado pelo seed inicial.',
      completed_at: row.status === 'concluida' ? eventDate : null,
      createdAt: eventDate,
      updatedAt: eventDate
    });
    if (created) createdReservations += 1;

    if (['concluida', 'cancelada'].includes(row.status)) {
      const wasCreated = await ensureHistory(History, {
        item_id: item.id,
        donor_id: maria.id,
        receiver_id: receiver.id,
        transaction_type: row.status === 'cancelada' ? 'cancelamento' : 'doacao',
        status: row.status,
        notes: row.status === 'cancelada' ? 'Doacao cancelada registrada no historico demonstrativo.' : 'Doacao concluida registrada no historico demonstrativo.',
        createdAt: eventDate,
        updatedAt: eventDate
      });
      if (wasCreated) createdHistory += 1;
    }
  }

  return { createdReservations, createdHistory };
}

async function ensureMariaReceivedData({ User, Item, Reservation, History }, maria) {
  let createdItems = 0;
  let createdReservations = 0;
  let createdHistory = 0;
  const donorsByEmail = new Map();

  for (const donorData of mariaReceivedDonors) {
    const donor = await ensureUser(User, { roles: ['doador'], verified: false, ...donorData });
    donorsByEmail.set(donor.email, donor);
  }

  for (const receivedItem of mariaReceivedItems) {
    const donor = donorsByEmail.get(receivedItem.donorEmail);
    if (!donor) continue;
    const { donorEmail, date, ...itemData } = receivedItem;
    const { item, created } = await ensureItem(Item, itemData, donor.id);
    if (created) createdItems += 1;

    const eventDate = new Date(date);
    const reservationStatus = statusToReservationStatus(itemData.status);
    const { created: reservationCreated } = await ensureReservation(Reservation, {
      item_id: item.id,
      user_id: maria.id,
      donor_id: donor.id,
      status: reservationStatus,
      message: 'Registro demonstrativo de item recebido pela Maria Clara.',
      completed_at: reservationStatus === 'concluida' ? eventDate : null,
      createdAt: eventDate,
      updatedAt: eventDate
    });
    if (reservationCreated) createdReservations += 1;

    if (['concluida', 'cancelada'].includes(reservationStatus)) {
      const wasCreated = await ensureHistory(History, {
        item_id: item.id,
        donor_id: donor.id,
        receiver_id: maria.id,
        transaction_type: 'recepcao',
        status: reservationStatus,
        notes: 'Recebimento demonstrativo migrado dos mocks do frontend.',
        createdAt: eventDate,
        updatedAt: eventDate
      });
      if (wasCreated) createdHistory += 1;
    }
  }

  return { createdItems, createdReservations, createdHistory };
}

async function seedDemoData({ User, Item, Reservation, History }) {
  const maria = await ensureUser(User, demoUser);
  const { createdItems, itemsByTitle } = await ensureDemoItems(Item, maria);
  const receiversByEmail = new Map();

  for (const receiverData of mariaDonationReceivers) {
    const receiver = await ensureUser(User, receiverData);
    receiversByEmail.set(receiver.email, receiver);
  }

  const donationSeed = await ensureDemoReservationsAndHistory({ Item, Reservation, History }, maria, receiversByEmail, itemsByTitle);
  const receivedSeed = await ensureMariaReceivedData({ User, Item, Reservation, History }, maria);

  return {
    user: maria,
    createdItems: createdItems + receivedSeed.createdItems,
    createdReservations: donationSeed.createdReservations + receivedSeed.createdReservations,
    createdHistory: donationSeed.createdHistory + receivedSeed.createdHistory,
    totalItems: mariaDonationItems.length + mariaReceivedItems.length
  };
}

module.exports = {
  demoUser,
  demoItems,
  demoReceivers,
  demoReservationRows,
  mariaDonationItems,
  mariaDonationReceivers,
  mariaDonationReservationRows,
  mariaReceivedDonors,
  mariaReceivedItems,
  buildDemoItemsForDonor,
  seedDemoData
};
