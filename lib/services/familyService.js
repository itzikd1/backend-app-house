const prisma = require('../prisma');

const createFamily = async (userId, name) => {
  // Check if user is already in a family
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { familyId: true },
  });
  if (user.familyId) {
    return { error: 'User already belongs to a family' };
  }
  // Create family and update user's family association in a transaction
  const [family] = await prisma.$transaction([
    prisma.family.create({
      data: {
        name,
        members: { connect: { id: userId } },
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { role: 'FAMILY_MEMBER' },
    }),
  ]);
  return family;
};

const getFamilyMembers = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      family: {
        include: {
          members: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });
  if (!user.family) {
    return { error: 'User not in a family' };
  }
  return user.family.members;
};

const removeFamilyMember = async (adminId, userId) => {
  // Check if current user is admin
  const currentUser = await prisma.user.findUnique({
    where: { id: adminId },
    select: { familyId: true, role: true },
  });
  if (currentUser.role !== 'ADMIN') {
    return { error: 'Only admin can remove members' };
  }
  // Check if target user exists and is in the same family
  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { familyId: true },
  });
  if (!targetUser || targetUser.familyId !== currentUser.familyId) {
    return { error: 'User not found in your family' };
  }
  // Remove user from family
  await prisma.user.update({
    where: { id: userId },
    data: { familyId: null, role: 'GUEST' },
  });
  return { message: 'Member removed successfully' };
};

const inviteUserToFamily = async (userId, email) => {
  // Check if current user is in a family
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { familyId: true, role: true },
  });
  if (!currentUser.familyId) {
    return { error: 'You are not in a family' };
  }
  // Check if target user exists and is not in a family
  const targetUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, familyId: true },
  });
  if (!targetUser) {
    return { error: 'User not found' };
  }
  if (targetUser.familyId) {
    return { error: 'User already belongs to a family' };
  }
  // Add them to the family
  await prisma.user.update({
    where: { email },
    data: { familyId: currentUser.familyId, role: 'FAMILY_MEMBER' },
  });
  return { message: 'User added to family successfully' };
};

module.exports = {
  createFamily,
  getFamilyMembers,
  removeFamilyMember,
  inviteUserToFamily,
};

