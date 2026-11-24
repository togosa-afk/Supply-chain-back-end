import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import sequelize from "../../db";

export enum ShipmentStatus {
  PENDING = "PENDING",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

class Shipment extends Model<
  InferAttributes<Shipment>,
  InferCreationAttributes<Shipment>
> {
  declare id: CreationOptional<string>;
  declare order_id: string;
  declare logistics_provider_id: string;
  declare status: CreationOptional<ShipmentStatus>;
  declare tracking_number: string | null;
  declare pickup_address_id: string;
  declare delivery_address_id: string;
  declare weight: string;
  declare estimated_delivery_date: Date | null;
  declare actual_delivery_date: Date | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date | null>;
}

Shipment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "orders", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    logistics_provider_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "logistics_providers", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ShipmentStatus)),
      allowNull: false,
      defaultValue: ShipmentStatus.PENDING,
    },
    tracking_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pickup_address_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "addresses", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    delivery_address_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "addresses", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    weight: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
    },
    estimated_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actual_delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Shipment",
    tableName: "shipments",
    timestamps: false,
  },
);

export { Shipment };
export default Shipment;
