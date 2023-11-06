import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";


const BankGraph = ({ data }) => {
    const [accountsVisibility, setAccountsVisibility] = useState({
        checkings: true,
        savings: true,
        other: true,
    });
    const [smallestValue, setSmallestValue] = useState(Number.POSITIVE_INFINITY);
    const [largestValue, setLargestValue] = useState(Number.NEGATIVE_INFINITY);

    useEffect(() => {
        if (!Array.isArray(data) || data.length === 0) {
            return; // Data is not in the expected format or is empty
        }

        // Calculate smallestValue and largestValue based on visible series
        let smallest = Number.POSITIVE_INFINITY;
        let largest = Number.NEGATIVE_INFINITY;

        data.forEach((item) => {
            if (accountsVisibility.checkings) {
                const num = Math.round(item.checkings);
                if (num < smallest) {
                    smallest = num;
                }
                if (num > largest) {
                    largest = num;
                }
            }

            if (accountsVisibility.savings) {
                const num = Math.round(item.savings);
                if (num < smallest) {
                    smallest = num;
                }
                if (num > largest) {
                    largest = num;
                }
            }

            if (accountsVisibility.other) {
                const num = Math.round(item.other);
                if (num < smallest) {
                    smallest = num;
                }
                if (num > largest) {
                    largest = num;
                }
            }
        });

        data.sort((a, b) => {
            // Compare the date values
            const dateComparison = new Date(a.date) - new Date(b.date);

            // If the date values are the same, compare the timestamp values
            if (dateComparison === 0) {
                return a.timestamp - b.timestamp;
            }

            return dateComparison;
        });
        setSmallestValue(smallest);
        setLargestValue(largest);
    }, [data, accountsVisibility]);

    const toggleAccountVisibility = (accountName) => {
        setAccountsVisibility((prevState) => ({
            ...prevState,
            [accountName]: !prevState[accountName],
        }));
    };

    return (
        <ResponsiveContainer width='100%' height={700}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    type="category"
                    tickFormatter={
                        (date) => new Date(date)
                            .toLocaleDateString('en-US', {
                                month: '2-digit',
                                day: '2-digit',
                                year: '2-digit',
                                timeZone: 'UTC'
                            })
                    }
                />
                <YAxis
                    domain={[smallestValue, largestValue]}
                />
                <Tooltip />
                <Legend
                    onClick={(e) => {
                        toggleAccountVisibility(e.dataKey);
                    }}
                />
                {/* Line for Checkings */}
                <Line
                    type="monotone"
                    dataKey="checkings"
                    name="Checkings"
                    stroke="#F64C72"
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                    hide={!accountsVisibility.checkings}
                />

                {/* Line for Savings */}
                <Line
                    type="monotone"
                    dataKey="savings"
                    name="Savings"
                    stroke="#5AA4FC"
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                    hide={!accountsVisibility.savings}
                />

                {/* Line for Other */}
                <Line
                    type="monotone"
                    dataKey="other"
                    name="Other"
                    stroke="#36A2A3"
                    activeDot={{ r: 8 }}
                    strokeWidth={3}
                    hide={!accountsVisibility.other}
                />
            </LineChart>
        </ResponsiveContainer >
    );
};

export default BankGraph;
