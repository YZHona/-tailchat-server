import { createTestServiceBroker } from '../../utils';
import UserDMListService from '../../../services/user/dmlist.service';
import { Types } from 'mongoose';

describe('Test "dmlist" service', () => {
  const { broker, service, insertTestData } =
    createTestServiceBroker<UserDMListService>(UserDMListService);

  describe('Test "user.dmlist.addConverse"', () => {
    test('addConverse should be ok', async () => {
      const userId = String(Types.ObjectId());
      const converseId = String(Types.ObjectId());

      await broker.call(
        'user.dmlist.addConverse',
        {
          converseId,
        },
        {
          meta: {
            userId,
          },
        }
      );

      try {
        const res = await service.adapter.model.findOne({
          userId,
        });

        expect(res.converseIds.map((r) => String(r))).toEqual([converseId]); // 应该被成功插入
      } finally {
        await service.adapter.model.deleteOne({
          userId,
        });
      }
    });

    test('addConverse should not be repeat', async () => {
      const userId = String(Types.ObjectId());
      const converseId = String(Types.ObjectId());

      await broker.call(
        'user.dmlist.addConverse',
        {
          converseId,
        },
        {
          meta: {
            userId,
          },
        }
      );

      await broker.call(
        'user.dmlist.addConverse',
        {
          converseId,
        },
        {
          meta: {
            userId,
          },
        }
      );

      try {
        const res = await service.adapter.model.findOne({
          userId,
        });

        expect(res.converseIds.map((r) => String(r))).toEqual([converseId]); // 应该被成功插入
      } finally {
        await service.adapter.model.deleteOne({
          userId,
        });
      }
    });

    test('addConverse can be add more', async () => {
      const userId = String(Types.ObjectId());
      const converseId = String(Types.ObjectId());
      const converseId2 = String(Types.ObjectId());

      await broker.call(
        'user.dmlist.addConverse',
        {
          converseId,
        },
        {
          meta: {
            userId,
          },
        }
      );

      await broker.call(
        'user.dmlist.addConverse',
        {
          converseId: converseId2,
        },
        {
          meta: {
            userId,
          },
        }
      );

      try {
        const res = await service.adapter.model.findOne({
          userId,
        });

        expect(res.converseIds.map((r) => String(r))).toEqual([
          converseId,
          converseId2,
        ]);
      } finally {
        await service.adapter.model.deleteOne({
          userId,
        });
      }
    });
  });
});