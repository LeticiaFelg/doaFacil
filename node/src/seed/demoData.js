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
    address: {
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro'
    }
  },
  {
    title: 'Guarda-roupa 4 portas',
    description: 'Madeira clara, espelho interno, sem trincas.',
    category: 'moveis',
    condition: 'bom',
    location: 'Botafogo, RJ',
    status: 'disponivel',
    images: ['./assets/img/items/item2.jpg'],
    dimensions: '',
    material: 'Madeira',
    color: 'Madeira clara',
    pickup: 'A combinar',
    address: {
      neighborhood: 'Botafogo',
      city: 'Rio de Janeiro'
    }
  },
  {
    title: 'Micro-ondas 30L',
    description: 'Funcionando perfeitamente, acompanha prato giratorio.',
    category: 'eletro',
    condition: 'otimo',
    location: 'Tijuca, RJ',
    status: 'disponivel',
    images: ['./assets/img/items/item3.jpg'],
    dimensions: '',
    material: '',
    color: '',
    pickup: 'A combinar',
    address: {
      neighborhood: 'Tijuca',
      city: 'Rio de Janeiro'
    }
  },
  {
    title: 'Kit roupas infantis',
    description: 'Tamanhos 4 a 8 anos, varias pecas, bem conservadas.',
    category: 'roupas',
    condition: 'otimo',
    location: 'Meier, RJ',
    status: 'disponivel',
    images: ['./assets/img/items/item4.jpg'],
    dimensions: '',
    material: '',
    color: 'Variadas',
    pickup: 'A combinar',
    address: {
      neighborhood: 'Meier',
      city: 'Rio de Janeiro'
    }
  },
  {
    title: 'Mesa de escritorio',
    description: 'Mesa retangular 120x60cm, arranhoes superficiais.',
    category: 'moveis',
    condition: 'usado',
    location: 'Centro, RJ',
    status: 'disponivel',
    images: ['./assets/img/items/item5.jpg'],
    dimensions: '120 x 60 cm',
    material: 'Madeira',
    color: '',
    pickup: 'A combinar',
    address: {
      neighborhood: 'Centro',
      city: 'Rio de Janeiro'
    }
  },
  {
    title: 'Conjunto de panelas',
    description: '5 pecas, antiaderente, sem lascas.',
    category: 'utensilios',
    condition: 'bom',
    location: 'Realengo, RJ',
    status: 'disponivel',
    images: ['./assets/img/items/item6.jpg'],
    dimensions: '',
    material: 'Antiaderente',
    color: '',
    pickup: 'A combinar',
    address: {
      neighborhood: 'Realengo',
      city: 'Rio de Janeiro'
    }
  },
  {
    title: 'Tenis esportivo 42',
    description: 'Pouco uso, solado em bom estado.',
    category: 'calcados',
    condition: 'bom',
    location: 'Jacarepagua',
    status: 'disponivel',
    images: ['./assets/img/items/item7.jpg'],
    dimensions: '42',
    material: '',
    color: '',
    pickup: 'A combinar',
    address: {
      neighborhood: 'Jacarepagua',
      city: 'Rio de Janeiro'
    }
  },
  {
    title: 'Livros didaticos',
    description: 'Ensino medio, completos, sem anotacoes.',
    category: 'escolar',
    condition: 'otimo',
    location: 'Vila Isabel',
    status: 'disponivel',
    images: ['./assets/img/items/item8.jpg'],
    dimensions: '',
    material: 'Papel',
    color: '',
    pickup: 'A combinar',
    address: {
      neighborhood: 'Vila Isabel',
      city: 'Rio de Janeiro'
    }
  },
  {
    title: 'Cama solteiro',
    description: 'Cama de madeira com colchao incluso, sem mofos.',
    category: 'moveis',
    condition: 'bom',
    location: 'Bonsucesso',
    status: 'disponivel',
    images: ['./assets/img/items/item9.jpg'],
    dimensions: '',
    material: 'Madeira',
    color: '',
    pickup: 'A combinar',
    address: {
      neighborhood: 'Bonsucesso',
      city: 'Rio de Janeiro'
    }
  },
  {
    title: 'Brinquedos variados',
    description: 'Quebra-cabecas, carrinhos e bonecas.',
    category: 'brinquedos',
    condition: 'bom',
    location: 'Sulacap',
    status: 'disponivel',
    images: ['./assets/img/items/item10.jpg'],
    dimensions: '',
    material: '',
    color: 'Variadas',
    pickup: 'A combinar',
    address: {
      neighborhood: 'Sulacap',
      city: 'Rio de Janeiro'
    }
  },
  {
    title: 'Geladeira 280L',
    description: 'Funciona bem, pequenas marcas externas.',
    category: 'eletro',
    condition: 'usado',
    location: 'Bangu',
    status: 'disponivel',
    images: ['./assets/img/items/item11.jpg'],
    dimensions: '280L',
    material: '',
    color: '',
    pickup: 'A combinar',
    address: {
      neighborhood: 'Bangu',
      city: 'Rio de Janeiro'
    }
  },
  {
    title: 'Mochila escolar',
    description: 'Nova, nunca usada, tamanho medio.',
    category: 'escolar',
    condition: 'otimo',
    location: 'Santa Cruz',
    status: 'disponivel',
    images: ['./assets/img/items/item12.jpg'],
    dimensions: 'Tamanho medio',
    material: '',
    color: '',
    pickup: 'A combinar',
    address: {
      neighborhood: 'Santa Cruz',
      city: 'Rio de Janeiro'
    }
  }
];

function buildDemoItemsForDonor(donorId) {
  return demoItems.map((item) => ({
    ...item,
    donor_id: donorId
  }));
}

async function seedDemoData({ User, Item }) {
  let maria = await User.findOne({
    where: { email: demoUser.email }
  });

  if (!maria) {
    maria = await User.create(demoUser);
  }

  const itemsForMaria = buildDemoItemsForDonor(maria.id);
  let createdItems = 0;

  for (const itemData of itemsForMaria) {
    const existingItem = await Item.findOne({
      where: {
        title: itemData.title,
        donor_id: maria.id
      }
    });

    if (!existingItem) {
      await Item.create(itemData);
      createdItems += 1;
    }
  }

  return {
    user: maria,
    createdItems,
    totalItems: itemsForMaria.length
  };
}

module.exports = {
  demoUser,
  demoItems,
  buildDemoItemsForDonor,
  seedDemoData
};
