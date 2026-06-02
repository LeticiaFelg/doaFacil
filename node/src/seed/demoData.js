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

const demoItems = [
  {
    title: 'Sofa de 3 lugares',
    description: 'Sofa em tecido cinza, leve desgaste nos bracos.',
    category: 'moveis',
    condition: 'bom',
    location: 'Copacabana, RJ',
    status: 'disponivel',
    images: ['./assets/img/items/item1.jpg'],
    dimensions: '220 x 85 x 90 cm',
    material: 'Tecido / Madeira',
    color: 'Cinza claro',
    pickup: 'A combinar',
    address: { neighborhood: 'Copacabana', city: 'Rio de Janeiro' }
  },
  {
    title: 'Guarda-roupa 4 portas',
    description: 'Madeira clara, espelho interno, sem trincas.',
    category: 'moveis',
    condition: 'bom',
    location: 'Botafogo, RJ',
    status: 'cancelado',
    images: ['./assets/img/items/item2.jpg'],
    dimensions: '',
    material: 'Madeira',
    color: 'Madeira clara',
    pickup: 'A combinar',
    address: { neighborhood: 'Botafogo', city: 'Rio de Janeiro' }
  },
  {
    title: 'Micro-ondas 30L',
    description: 'Funcionando perfeitamente, acompanha prato giratorio.',
    category: 'eletro',
    condition: 'otimo',
    location: 'Tijuca, RJ',
    status: 'reservado',
    images: ['./assets/img/items/item3.jpg'],
    dimensions: '',
    material: '',
    color: '',
    pickup: 'A combinar',
    address: { neighborhood: 'Tijuca', city: 'Rio de Janeiro' }
  },
  {
    title: 'Kit roupas infantis',
    description: 'Tamanhos 4 a 8 anos, varias pecas, bem conservadas.',
    category: 'roupas',
    condition: 'otimo',
    location: 'Meier, RJ',
    status: 'concluido',
    images: ['./assets/img/items/item4.jpg'],
    dimensions: '',
    material: '',
    color: 'Variadas',
    pickup: 'A combinar',
    address: { neighborhood: 'Meier', city: 'Rio de Janeiro' }
  },
  {
    title: 'Mesa de escritorio',
    description: 'Mesa retangular 120x60cm, arranhoes superficiais.',
    category: 'moveis',
    condition: 'usado',
    location: 'Centro, RJ',
    status: 'concluido',
    images: ['./assets/img/items/item5.jpg'],
    dimensions: '120 x 60 cm',
    material: 'Madeira',
    color: '',
    pickup: 'A combinar',
    address: { neighborhood: 'Centro', city: 'Rio de Janeiro' }
  },
  {
    title: 'Conjunto de panelas',
    description: '5 pecas, antiaderente, sem lascas.',
    category: 'utensilios',
    condition: 'bom',
    location: 'Realengo, RJ',
    status: 'concluido',
    images: ['./assets/img/items/item6.jpg'],
    dimensions: '',
    material: 'Antiaderente',
    color: '',
    pickup: 'A combinar',
    address: { neighborhood: 'Realengo', city: 'Rio de Janeiro' }
  },
  {
    title: 'Tenis esportivo 42',
    description: 'Pouco uso, solado em bom estado.',
    category: 'calcados',
    condition: 'bom',
    location: 'Jacarepagua',
    status: 'concluido',
    images: ['./assets/img/items/item7.jpg'],
    dimensions: '42',
    material: '',
    color: '',
    pickup: 'A combinar',
    address: { neighborhood: 'Jacarepagua', city: 'Rio de Janeiro' }
  },
  {
    title: 'Livros didaticos',
    description: 'Ensino medio, completos, sem anotacoes.',
    category: 'escolar',
    condition: 'otimo',
    location: 'Vila Isabel',
    status: 'concluido',
    images: ['./assets/img/items/item8.jpg'],
    dimensions: '',
    material: 'Papel',
    color: '',
    pickup: 'A combinar',
    address: { neighborhood: 'Vila Isabel', city: 'Rio de Janeiro' }
  },
  {
    title: 'Cama solteiro',
    description: 'Cama de madeira com colchao incluso, sem mofos.',
    category: 'moveis',
    condition: 'bom',
    location: 'Bonsucesso',
    status: 'concluido',
    images: ['./assets/img/items/item9.jpg'],
    dimensions: '',
    material: 'Madeira',
    color: '',
    pickup: 'A combinar',
    address: { neighborhood: 'Bonsucesso', city: 'Rio de Janeiro' }
  },
  {
    title: 'Brinquedos variados',
    description: 'Quebra-cabecas, carrinhos e bonecas.',
    category: 'brinquedos',
    condition: 'bom',
    location: 'Sulacap',
    status: 'concluido',
    images: ['./assets/img/items/item10.jpg'],
    dimensions: '',
    material: '',
    color: 'Variadas',
    pickup: 'A combinar',
    address: { neighborhood: 'Sulacap', city: 'Rio de Janeiro' }
  },
  {
    title: 'Geladeira 280L',
    description: 'Funciona bem, pequenas marcas externas.',
    category: 'eletro',
    condition: 'usado',
    location: 'Bangu',
    status: 'concluido',
    images: ['./assets/img/items/item11.jpg'],
    dimensions: '280L',
    material: '',
    color: '',
    pickup: 'A combinar',
    address: { neighborhood: 'Bangu', city: 'Rio de Janeiro' }
  },
  {
    title: 'Mochila escolar',
    description: 'Nova, nunca usada, tamanho medio.',
    category: 'escolar',
    condition: 'otimo',
    location: 'Santa Cruz',
    status: 'concluido',
    images: ['./assets/img/items/item12.jpg'],
    dimensions: 'Tamanho medio',
    material: '',
    color: '',
    pickup: 'A combinar',
    address: { neighborhood: 'Santa Cruz', city: 'Rio de Janeiro' }
  }
];

const demoReceivers = [
  { name: 'Ana Lima', email: 'ana.lima.demo@example.com', cpf: '11111111111', bairro: 'Tijuca' },
  { name: 'ONG Recomeço', email: 'ong.recomeco.demo@example.com', cpf: '22222222222', bairro: 'Meier' },
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

const demoReservationRows = [
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

function buildDemoItemsForDonor(donorId) {
  return demoItems.map((item) => ({
    ...item,
    donor_id: donorId
  }));
}

async function ensureUser(User, userData) {
  let user = await User.findOne({ where: { email: userData.email } });

  if (!user) {
    user = await User.create({
      password: 'senha123',
      phone: '21990000000',
      location: `${userData.bairro}, Rio de Janeiro - RJ`,
      avatar: userData.name.slice(0, 2).toUpperCase(),
      verified: false,
      roles: ['receptor'],
      ...userData
    });
  }

  return user;
}

async function ensureDemoItems(Item, maria) {
  const itemsForMaria = buildDemoItemsForDonor(maria.id);
  let createdItems = 0;
  const itemsByTitle = new Map();

  for (const itemData of itemsForMaria) {
    let item = await Item.findOne({
      where: {
        title: itemData.title,
        donor_id: maria.id
      }
    });

    if (!item) {
      item = await Item.create(itemData);
      createdItems += 1;
    } else if (item.status !== itemData.status) {
      item.status = itemData.status;
      await item.save();
    }

    itemsByTitle.set(item.title, item);
  }

  return { createdItems, itemsByTitle };
}

async function ensureDemoReservationsAndHistory({ Item, Reservation, History }, maria, receiversByEmail, itemsByTitle) {
  if (!Reservation || !History) {
    return { createdReservations: 0, createdHistory: 0 };
  }

  let createdReservations = 0;
  let createdHistory = 0;

  for (const row of demoReservationRows) {
    const item = itemsByTitle.get(row.itemTitle) || await Item.findOne({
      where: {
        title: row.itemTitle,
        donor_id: maria.id
      }
    });
    const receiver = receiversByEmail.get(row.receiverEmail);

    if (!item || !receiver) {
      continue;
    }

    let reservation = await Reservation.findOne({
      where: {
        item_id: item.id,
        user_id: receiver.id,
        donor_id: maria.id
      }
    });

    const eventDate = new Date(row.date);
    const completedAt = row.status === 'concluida' ? eventDate : null;

    if (!reservation) {
      reservation = await Reservation.create({
        item_id: item.id,
        user_id: receiver.id,
        donor_id: maria.id,
        status: row.status,
        message: 'Registro demonstrativo criado pelo seed inicial.',
        completed_at: completedAt,
        createdAt: eventDate,
        updatedAt: eventDate
      });
      createdReservations += 1;
    }

    if (['concluida', 'cancelada'].includes(row.status)) {
      const transactionType = row.status === 'cancelada' ? 'cancelamento' : 'doacao';
      const historyStatus = row.status;
      const existingHistory = await History.findOne({
        where: {
          item_id: item.id,
          donor_id: maria.id,
          receiver_id: receiver.id,
          transaction_type: transactionType
        }
      });

      if (!existingHistory) {
        await History.create({
          item_id: item.id,
          donor_id: maria.id,
          receiver_id: receiver.id,
          transaction_type: transactionType,
          status: historyStatus,
          notes: row.status === 'cancelada'
            ? 'Doacao cancelada registrada no historico demonstrativo.'
            : 'Doacao concluida registrada no historico demonstrativo.',
          createdAt: eventDate,
          updatedAt: eventDate
        });
        createdHistory += 1;
      }
    }
  }

  return { createdReservations, createdHistory };
}

async function seedDemoData({ User, Item, Reservation, History }) {
  let maria = await User.findOne({
    where: { email: demoUser.email }
  });

  if (!maria) {
    maria = await User.create(demoUser);
  }

  const { createdItems, itemsByTitle } = await ensureDemoItems(Item, maria);
  const receiversByEmail = new Map();

  for (const receiverData of demoReceivers) {
    const receiver = await ensureUser(User, receiverData);
    receiversByEmail.set(receiver.email, receiver);
  }

  const { createdReservations, createdHistory } = await ensureDemoReservationsAndHistory(
    { Item, Reservation, History },
    maria,
    receiversByEmail,
    itemsByTitle
  );

  return {
    user: maria,
    createdItems,
    createdReservations,
    createdHistory,
    totalItems: demoItems.length
  };
}

module.exports = {
  demoUser,
  demoItems,
  demoReceivers,
  demoReservationRows,
  buildDemoItemsForDonor,
  seedDemoData
};
