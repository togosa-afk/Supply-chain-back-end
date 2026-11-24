import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import sequelize from "../../db";

export enum ShippingOfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

class ShippingOffer extends Model<
  InferAttributes<ShippingOffer>,
  InferCreationAttributes<ShippingOffer>
> {
  declare id: CreationOptional<string>;
  declare shipment_id: string;
  declare logistics_provider_id: string;
  declare price: string;
  declare currency: string;
  declare estimated_delivery_days: number;
  declare status: CreationOptional<ShippingOfferStatus>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date | null>;
}

ShippingOffer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shipment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "shipments", key: "id" },
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
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estimated_delivery_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ShippingOfferStatus)),
      allowNull: false,
      defaultValue: ShippingOfferStatus.PENDING,
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
    modelName: "ShippingOffer",
    tableName: "shipping_offers",
    timestamps: false,
  },
);

export { ShippingOffer };
export default ShippingOffer;
